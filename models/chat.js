/** @format */

const db = require("../db");
const { textParser } = require("../helpers/textParser");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Chat {
  static async getResponse({ statement, friend_id, username }) {
    let parsed = textParser(statement);
    if (parsed.length < 1) {
      return { response: "You didn't say anything important" };
    }

    const word = parsed[Math.floor(Math.random() * parsed.length)];
    console.log(word)
    const res = await db.query(
      `SELECT id FROM statements WHERE statement LIKE '%${word}%' AND friend_id = $1`,
      [friend_id]
    );
    console.log(res.rows)
    if (res.rows.length < 1) {
      return "I have no response" ;
    }
    
    let statementId = res.rows[Math.floor(Math.random() * res.rows.length)].id;

    let res2 = await db.query(
      `SELECT response FROM responses WHERE statement_id = $1`,
      [statementId]
    );

    while (res2.rows.length == 0) {
      statementId = res.rows[Math.floor(Math.random() * res.rows.length)].id;

      res2 = await db.query(
        `SELECT response FROM responses WHERE statement_id = $1`,
        [statementId]
      );
    }

    const response =
      res2.rows[Math.floor(Math.random() * res2.rows.length)].response;

    return response;
  }
}

module.exports = Chat;
