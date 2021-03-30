/** @format */

const db = require("../db");
const { textParser } = require("../helpers/textParser");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");



class Response {
  //Create a response.
  static async create({ response, statement_id, username }) {
    const res = await db.query(
      `INSERT INTO responses (response, statement_id, username) VALUES ($1, $2, $3) RETURNING id, response, statement_id`,
      [response.toLowerCase(), statement_id, username]
    );
    return res.rows[0];
  }

  //Delete a response
  static async delete(username, id) {
    try {
      const res = await db.query(
        `
      DELETE FROM responses WHERE username = $1 AND id = $2
    `,
        [username, id]
      );
      return { message: "success" };
    } catch (err) {
      return { error: err };
    }
  }

  //Update a response
  static async update(username, id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      response: "response",
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const responseVarIdx = "$" + (values.length + 2);

    const querySql = `UPDATE responses 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} AND id = ${responseVarIdx}
                      RETURNING username, 
                                response, 
                                statement_id`;

    const result = await db.query(querySql, [...values, username, id]);
    const response = result.rows[0];

    if (!response) throw new NotFoundError(`No response: ${id}`);

    return response;
  }
}


module.exports = Response;