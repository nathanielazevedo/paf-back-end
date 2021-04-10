/** @format */

const db = require("../db");
const { textParser } = require("../helpers/textParser");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Statement {
  //Add a statment.
  static async create({ statement, friend_id, username }) {
    const res = await db.query(
      `INSERT INTO statements (statement, friend_id, username) VALUES ($1, $2, $3) RETURNING id, statement, friend_id`,
      [statement.toLowerCase(), friend_id, username]
    );
    return res.rows[0];
  }

  //Get a statement and all responses for that statement.
  static async getStatement(username, statementId) {
    let statement = await db.query(
      `SELECT statement, id, friend_id FROM statements WHERE id = $1 AND username = $2`,
      [statementId, username]
    );

    if (!statement.rows[0]) {
      throw new NotFoundError();
    }

    statement = statement.rows[0];
    const responses = await db.query(
      `SELECT response, id, statement_id FROM responses WHERE statement_id = $1`,
      [statementId]
    );
    statement.responses = responses.rows;
    return statement;
  }

  //Update a statement
  static async update(username, id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      username: "username",
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const statementVarIdx = "$" + (values.length + 2);

    const querySql = `UPDATE statements 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} AND id = ${statementVarIdx}
                      RETURNING username, 
                                statement, 
                                id`;

    const result = await db.query(querySql, [...values, username, id]);
    const statement = result.rows[0];

    if (!statement) throw new NotFoundError(`No statement: ${id}`);

    return statement;
  }

  //Delete a statement
  static async delete(username, id) {
    const res = await db.query(
      `
      DELETE FROM statements WHERE username = $1 AND id = $2 RETURNING username
    `,
      [username, id]
    );
    if (!res.rows[0]) throw new NotFoundError(`No statement ${id}`);
    return { message: "success" };
  }
}

module.exports = Statement;
