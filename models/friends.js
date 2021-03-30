/** @format */

const db = require("../db");
const { textParser } = require("../helpers/textParser");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Friend {
  //Creates a new friend.
  static async create({ name, username, description }) {
    const res = await db.query(
      `INSERT INTO friends (name, username, description) VALUES ($1, $2, $3) RETURNING id, name, description`,
      [name, username, description]
    );
    return res.rows[0];
  }

  //Gets all friends for a user.
  static async getFriends(username) {
    const res = await db.query(
      `SELECT name, id, description FROM friends WHERE username = $1`,
      [username]
    );
    return res.rows;
  }

  //Gets a specific friend.
  static async getFriend(username, friendId) {
    let friend = await db.query(
      `SELECT name, id, description FROM friends WHERE id = $1 AND username = $2`,
      [friendId, username]
    );

    if (!friend.rows[0]) throw new NotFoundError(`No friend found.`);

    friend = friend.rows[0];
    const statements = await db.query(
      `SELECT statement, id, friend_id FROM statements WHERE friend_id = $1`,
      [friendId]
    );
    friend.statements = statements.rows;
    return friend;
  }

  static async delete(username, friendId) {
    const res = await db.query(`DELETE FROM friends WHERE id = $1`, [friendId]);
    return { message: "deleted" };
  }

  //Update a friend
  static async update(username, id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: "name",
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const friendVarIdx = "$" + (values.length + 2);

    const querySql = `UPDATE friends 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} AND id = ${friendVarIdx}
                      RETURNING username, 
                                name, 
                                description`;

    const result = await db.query(querySql, [...values, username, id]);
    const friend = result.rows[0];

    if (!friend) throw new NotFoundError(`No friend: ${username}`);

    return user;
  }

  //Delete a friend
  static async delete(username, id) {
    try {
      const res = await db.query(
        `
      DELETE FROM friends WHERE username = $1 AND id = $2
    `,
        [username, id]
      );
      return { message: "success" };
    } catch (err) {
      return { error: err };
    }
  }
}


module.exports = Friend;