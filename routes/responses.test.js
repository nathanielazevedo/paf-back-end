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
  adminToken,
  u2Token,
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

  const response = await request(app)
    .post("/responses/u1")
    .send({
      statement_id: statement.body.id,
      response: "hello",
    })
    .set("authorization", `Bearer ${u1Token}`);
});

describe("POST /responses", function () {
  test("works for right user", async function () {
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

    const response = await request(app)
      .post("/responses/u1")
      .send({
        statement_id: statement.body.id,
        response: "hello",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      id: expect.any(Number),
      statement_id: statement.body.id,
      response: "hello",
    });
  });

  test("throws error if no token", async function () {
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

    const response = await request(app).post("/responses/u1").send({
      statement_id: statement.body.id,
      response: "hello",
    });

    expect(response.statusCode).toEqual(401);
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

    const response = await request(app).post("/responses/u1").send({
      statement_id: statement.body.id,
      response: "hello",
    });

    expect(response.statusCode).toEqual(401);
  });

  test("doesn't work for other user", async function () {
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

    const response = await request(app).post("/responses/u1").send({
      statement_id: statement.body.id,
      response: "hello",
    });

    expect(response.statusCode).toEqual(401);
  });

  test("doesn't work for bad data", async function () {
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

    const response = await request(app)
      .post("/responses/u1")
      .send({
        statement_id: "bad",
        response: "hello",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.statusCode).toEqual(400);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/responses/u1/${id}`)
      .send({
        response: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({
      response: "New",
      statement_id: expect.any(Number),
      username: "u1",
    });
  });

  test("works for same user", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/responses/u1/${id}`)
      .send({
        response: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      response: "New",
      statement_id: expect.any(Number),
      username: "u1",
    });
  });

  test("unauth for anon", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app).patch(`/responses/u1/${id}`).send({
      response: "New",
    });

    expect(resp.statusCode).toEqual(401);
  });

  test("response not found", async function () {
    const resp = await request(app)
      .patch(`/responses/u1/9999`)
      .send({
        response: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("err for bad data", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .patch(`/responses/u1/${id}`)
      .send({
        response: 5,
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /username/:response_id", function () {
  test("works for admin", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/responses/u1/${id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("works for admin", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/responses/u1/${id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("works for admin", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app)
      .delete(`/responses/u1/${id}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("err for anon", async function () {
    const res = await db.query(
      "SELECT * FROM responses WHERE response='hello'"
    );

    let id = res.rows[0].id;

    const resp = await request(app).delete(`/responses/u1/${id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("fails for unfound response", async function () {
    const resp = await request(app)
      .delete(`/responses/u1/9999`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
