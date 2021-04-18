/** @format */

const express = require("express");
const router = new express.Router();
const Statement = require("../models/statements");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const addStatementSchema = require("../schemas/addStatement.json");
const updateStatementSchema = require("../schemas/updateStatement.json");
const { NotFoundError, BadRequestError } = require("../expressError");

//Add a statement to a friend.
router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      // const validator = jsonschema.validate(req.body, addStatementSchema);
      // if (!validator.valid) {
      //   const errs = validator.errors.map((e) => e.stack);
      //   throw new BadRequestError();
      // }
      console.log('adding')
      const data = req.body;
      data.username = req.params.username;
      const statement = await Statement.create(data);
      return res.json(statement);
    } catch (err) {
      return next(err);
    }
  }
);

//Get info on a statment.
router.get(
  "/:username/:statementId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, statementId } = req.params;
      const statement = await Statement.getStatement(username, statementId);
      return res.json(statement);
    } catch (err) {
      return next(err);
    }
  }
);

//Delete user statement.
router.delete(
  "/:username/:statementId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, statementId } = req.params;
      const response = await Statement.delete(username, statementId);
      return res.json(response);
    } catch (err) {
      return next(err);
    }
  }
);

//Update a statement.
router.patch(
  "/:username/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateStatementSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError();
      }
      const username = req.params.username;
      const id = req.params.id;
      const data = req.body;
      const message = await Statement.update(username, id, data);
      return res.json(message);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
