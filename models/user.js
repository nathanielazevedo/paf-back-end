/** @format */

const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql")


class User {

  //Handle user authentication.
  static async authenticate(username, password) {
    try {
      const result = await db.query(
        `SELECT username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
        [username]
      );

      const user = result.rows[0];

      if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
          delete user.password;
          return user;
        }
      }
    } catch {
      throw new UnauthorizedError("Invalid username/password");
    }
  }

  
  //Handle user registration
  static async register({username, password, firstName, lastName, email, isAdmin}) {
    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError("Username taken");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    let result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  
  //Get all info about a user
  static async getUserInfo(username) {
    const userRes = await db.query(
      `SELECT username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  //Delete a user 
  static async delete(username) {
    try {
      const res = await db.query(`
      DELETE FROM users WHERE username = $1
    `, [username]);
      return ({message: 'success'})
    } catch (err){
      return ({error: err})
    }
  }

  //Update a user  
  static async update(username, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name"
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username, 
                                last_name AS "lastName", 
                                first_name AS "firstName", 
                                email `;
                                
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }


}

module.exports = User;
