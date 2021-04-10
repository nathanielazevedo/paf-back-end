/** @format */
//DONE
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Friend = require("./friends.js");
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

///////////////////////////////CREATE

describe("create", function () {
  let newFriend = {
    name: "testFriend",
    username: "u1",
    description: "testDescription",
  };

  test("works", async function () {
    let friend = await Friend.create(newFriend);
    delete newFriend.username;
    expect(friend).toEqual({
      ...newFriend,
      id: expect.any(Number),
    });
  });

  test("fails if bad data sent", async function () {
    try {
      let res = await Friend.create("nope");
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/////////////////////////////////////////UPDATE

describe("update", function () {
  let newFriend = {
    name: "testFriend",
    username: "u1",
    description: "testDescription",
  };

  let updateFriend = {
    name: "newtestFriend",
    description: "newtestDescription",
  };

  test("works", async function () {
    let friend = await Friend.create(newFriend);
    let updatedFriend = await Friend.update("u1", friend.id, updateFriend);
    expect(updatedFriend).toEqual({
      username: "u1",
      ...updateFriend,
    });
  });

  test("not found if no such friend", async function () {
    try {
      let updatedFriend = await Friend.update("u1", friend.id, updateFriend);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      let updatedFriend = await Friend.update("u1", friend.id, updateFriend);
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/////////////////////////////////////////REMOVE

describe("remove", function () {
    let newFriend = {
      name: "testFriend",
      username: "u1",
      description: "testDescription",
    };
  test("works", async function () {
    let friend = await Friend.create(newFriend);
    await Friend.delete("u1", friend.id);
    const res = await db.query(
        "SELECT * FROM friends WHERE name='testFriend'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such friend", async function () {
    try {
      await Friend.delete("ul","nope");
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});