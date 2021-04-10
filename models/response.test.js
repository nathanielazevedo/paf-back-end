/** @format */
//DONE
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Friend = require("./friends.js");
const Statement = require("./statements.js");
const Response = require("./responses.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { response } = require("express");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

beforeAll(async function () {
  let newFriend = {
    name: "testFriend",
    username: "u1",
    description: "testDescription",
  };

  let friend = await Friend.create(newFriend);
  let statement = {
    statement: "teststatement",
    friend_id: friend.id,
    username: "u1",
  };
  statementData = await Statement.create(statement);
});

/////////////////////////////////////////CREATE

describe("create", function () {
  let newFriend = {
    name: "testFriend",
    username: "u1",
    description: "testDescription",
  };

  test("works", async function () {
    let friend = await Friend.create(newFriend);
    let statement = {
      statement: "teststatement",
      friend_id: friend.id,
      username: "u1",
    };
    let statementData = await Statement.create(statement);
    let response = {
      response: "testresponse",
      statement_id: statementData.id,
      username: "u1",
    };
    let responseData = await Response.create(response);
    delete response.username;
    expect(responseData).toEqual({
      ...response,
      id: expect.any(Number),
    });
  });

  test("fails if bad data sent", async function () {
    try {
      delete response.response;
      let responseData = await Response.create(response);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/////////////////////////////////////////UPDATE

describe("update", function () {
  test("works", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='testStatement'"
    );

    let response = {
      response: "testresponse",
      statement_id: statementData.id,
      username: "u1",
    };

    let updateResponse = {
      response: "updatedResponse",
    };
    let responsed = await Response.create(response);
    let updatedResponse = await Response.update(
      "u1",
      responsed.id,
      updateResponse
    );
    expect(updatedResponse).toEqual({
      username: "u1",
      ...updateResponse,
      statement_id: expect.any(Number),
    });
  });

  test("not found if no such response", async function () {
    let updateResponse = {
      response: "updatedResponse",
    };
    try {
      let updatedResponse = await Response.update("u1", 9999, updateResponse);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='testStatement'"
    );

    let response = {
      response: "testresponse",
      statement_id: statementData.id,
      username: "u1",
    };
    let responsed = await Response.create(response);
    expect.assertions(1);
    try {
      let updatedResponse = await Response.update(
        "u1",
        responsed.id,
        updateFriend
      );
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** DELETE */

describe("remove", function () {
  test("works", async function () {
    const res = await db.query(
      "SELECT * FROM statements WHERE statement='testStatement'"
    );

    let response = {
      response: "testresponse",
      statement_id: statementData.id,
      username: "u1",
    };
    let responsed = await Response.create(response);

    await Response.delete("u1", responsed.id);
    const res2 = await db.query("SELECT * FROM responses WHERE username='u1'");
    expect(res2.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await Friend.delete("ul", "nope");
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
