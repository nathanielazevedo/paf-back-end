/** @format */
//DONE
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Friend = require("./friends.js");
const Statement = require("./statements.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


///////////////////////////////////////////CREATE

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
    }
    let statementData = await Statement.create(statement);
    delete statement.username
    expect(statementData).toEqual({
      ...statement,
      id: expect.any(Number),
    });
  });

  test("fails with bad data", async function () {
    try {
      let friend = await Friend.create(newFriend);
      let statement = {
        statement: "teststatement",
        friend_id: friend.id,
        username: "dog",
      };
      let statementData = await Statement.create(statement);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});


/************************************** UPDATE */

describe("update", function () {
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
    let updatedStatement = {
      statement: "updatedTeststatement",
    };

    let newStatement= await Statement.update("u1", statementData.id, updatedStatement);
    expect(newStatement).toEqual({
      username: "u1",
      ...updatedStatement,
      id: expect.any(Number),
    });
  });

  test("not found if no such user", async function () {
    try {
      let updatedStatement = await Statment.update("u1", 9999, updateFriend);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      let updatedStatement = await Statement.update("u1", friend.id, "nothing");
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});


/************************************** DELETE */

describe("remove", function () {

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
    }
    let statementData = await Statement.create(statement);

    await Statement.delete("u1", statementData.id);
    const res = await db.query(
        "SELECT * FROM statements WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await Statement.delete("ul","nope");
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});