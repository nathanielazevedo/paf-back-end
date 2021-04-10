/** @format */

"use strict";

const request = require("supertest");

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

describe("POST /friends/username", function () {
  test("creates a friend", async function () {
    const resp = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      name: "testFriend",
      description: "testFriend description",
      id: expect.any(Number),
    });
  });
});

describe("POST /friends/username/friendId", function () {
  test("creates a friend", async function () {
    const resp = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);
    const resp2 = await request(app)
      .get(`/friends/u1/${resp.body.id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp2.statusCode).toEqual(200);
  });

  test("throws error if no token", async function () {
    const resp = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);
    const resp2 = await request(app).get(`/friends/u1/${resp.body.id}`);
    expect(resp2.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/friends/u1/${respF.body.id}`)
      .send({
        name: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({
      description: "testFriend description",
      name: "New",
      username: "u1",
    });
  });

  test("works for same user", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/friends/u1/${respF.body.id}`)
      .send({
        name: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      description: "testFriend description",
      name: "New",
      username: "u1",
    });
  });

  test("unauth for not sameuser", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/friends/u1/${respF.body.id}`)
      .send({
        name: "New",
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app).patch(`/friends/u1/${respF.body.id}`).send({
      name: "New",
    });

    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such friend", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/friends/u1/999999`)
      .send({
        name: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("bad request for invalid data", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/friends/u1/${respF.body.id}`)
      .send({
        frog: 999,
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    let id = respF.body.id;
    const resp = await request(app)
      .delete(`/friends/u1/${id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("works for same user", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    let id = respF.body.id;
    const resp = await request(app)
      .delete(`/friends/u1/${id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ message: "success" });
  });

  test("unauth for different user", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    let id = respF.body.id;
    const resp = await request(app)
      .delete(`/friends/u1/${id}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    let id = respF.body.id;
    const resp = await request(app).delete(`/friends/u1/${id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("fails for unfound friend", async function () {
    const respF = await request(app)
      .post("/friends/u1")
      .send({
        name: "testFriend",
        description: "testFriend description",
      })
      .set("authorization", `Bearer ${u1Token}`);

    let id = respF.body.id;
    const resp = await request(app)
      .delete(`/friends/u1/9999`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
