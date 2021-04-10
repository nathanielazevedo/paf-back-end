/** @format */

const express = require("express");
const router = new express.Router();
const Response = require("../models/responses");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const addResponseSchema = require("../schemas/addResponse.json");
const updateResponseSchema = require("../schemas/updateResponse.json");
const { NotFoundError, BadRequestError } = require("../expressError");

//Add a new response to a statement.
router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, addResponseSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError();
      }
      let data = req.body;
      data.username = req.params.username;
      const response = await Response.create(data);
      return res.json(response);
    } catch (err) {
      return next(err);
    }
  }
);

//Delete user response.
router.delete(
  "/:username/:responseId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, responseId } = req.params;
      const response = await Response.delete(username, responseId);
      return res.json(response);
    } catch (err) {
      return next(err);
    }
  }
);

//Update a response.
router.patch(
  "/:username/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateResponseSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError();
      }
      const username = req.params.username;
      const id = req.params.id;
      const data = req.body;
      const message = await Response.update(username, id, data);
      return res.json(message);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
