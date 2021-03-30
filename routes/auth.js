/** @format */

const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError } = require("../expressError");
const express = require("express");
const router = new express.Router();
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const User = require("../models/user");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens");


//Handles user signup/register.

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError();
    }
    const { username, password, firstName, lastName, email, isAdmin = false } = req.body;
    const newUser = await User.register({ username, password, firstName, lastName, email, isAdmin });
    const token = createToken(newUser);

    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});


//Handle user login.

router.post("/login", async function (req, res, next) {
  try {
    console.log('hello')
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError();
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
