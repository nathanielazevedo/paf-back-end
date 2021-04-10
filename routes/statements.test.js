/** @format */

"use strict";

const request = require("supertest");
const db = require("../db.js");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

beforeEach(async function () {
  const friend = await request(app)
    .post("/friends/u1")
    .send({
      name: "testFriend",
      description: "testFriend description",
    })
    .set("authorization", `Bearer ${u1Token}`);

  const statement = await request(app)
    .post("/statements/u1")
    .send({
      friend_id: friend.body.id,
      statement: "hey",
    })
    .set("authorization", `Bearer ${u1Token}`);
});

describe("POST /friends", function () {
  test("works for same user", async function () {
    const friend = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const statement = await request(app)
      .post("/statements/u1")
      .send({
        friend_id: friend.body.id,
        statement: "hey",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(statement.body).toEqual({
      friend_id: expect.any(Number),
      statement: "hey",
      id: expect.any(Number),
    });
  });

  test("works for admins", async function () {
    const friend = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const statement = await request(app)
      .post("/statements/u1")
      .send({
        friend_id: friend.body.id,
        statement: "hey",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(statement.body).toEqual({
      friend_id: expect.any(Number),
      statement: "hey",
      id: expect.any(Number),
    });
  });

  test("fails for no token", async function () {
    const friend = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const statement = await request(app).post("/statements/u1").send({
      friend_id: friend.body.id,
      statement: "hey",
    });

    expect(statement.statusCode).toEqual(401);
  });

  test("fails for no wrong token", async function () {
    const friend = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const statement = await request(app)
      .post("/statements/u1")
      .send({
        friend_id: friend.body.id,
        statement: "hey",
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(statement.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/statements/u1/${id}`)
      .send({
        statement: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({
      id: expect.any(Number),
      statement: "New",
      username: "u1",
    });
  });

  test("works for same user", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/statements/u1/${id}`)
      .send({
        statement: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      id: expect.any(Number),
      statement: "New",
      username: "u1",
    });
  });

  test("unauth for anon", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app).patch(`/statements/u1/${id}`).send({
      statement: "New",
    });

    expect(resp.statusCode).toEqual(401);
  });

  test("statement not found", async function () {
    const resp = await request(app)
      .patch(`/statements/u1/99999`)
      .send({
        statement: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("bad if data is bad", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/statements/u1/${id}`)
      .send({
        bad: 999,
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/statements/u1/${id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("works for same token as user", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/statements/u1/${id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("does not work for other user", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/statements/u1/${id}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("err for anon", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app).delete(`/statements/u1/${id}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("fails for unfound user", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='hey'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/statements/u1/9999`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
