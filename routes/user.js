/** @format */

const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const updateUserSchema = require("../schemas/updateUser.json");
const { NotFoundError, BadRequestError } = require("../expressError");



router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
      const username = req.params.username;
      const user = await User.getUserInfo(username);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }
);

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
      const username = req.params.username;
      const message = await User.delete(username);
      return res.json(message);
    } catch (err) {
      return next(err);
    }
  }
);

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
      const validator = jsonschema.validate(req.body, updateUserSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        console.log(errs)
        throw new BadRequestError();
      }
      const username = req.params.username;
      const data = req.body;
      const message = await User.update(username, data);
      return res.json(message);
    } catch (err) {
      return next(err);
    }
  }
);



module.exports = router;