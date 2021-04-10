/** @format */

const express = require("express");
const router = new express.Router();
const Friend = require("../models/friends");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const addFriendSchema = require("../schemas/addFriend.json");
const updateFriendSchema = require("../schemas/updateFriend.json");
const { NotFoundError, BadRequestError } = require("../expressError");

//Add a friend for a user.
//req.body = { "friendName": "testFriend" };
//Set username on req.body with req.params.username.
//Therefore, req.body = {"friendName": "testFriend", "username": "testUser"}
router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    const validator = jsonschema.validate(req.body, addFriendSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError();
    }
    try {
      let data = req.body;
      data.username = req.params.username;
      const friend = await Friend.create(data);
      return res.json(friend);
    } catch (err) {
      return next(err);
    }
  }
);

//Get all friends for a user.
router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username } = req.params;
      const friends = await Friend.getFriends(username);
      return res.json(friends);
    } catch (err) {
      return next(err);
    }
  }
);

//Get info on a specific friend
router.get(
  "/:username/:friendId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, friendId } = req.params;
      const friend = await Friend.getFriend(username, friendId);
      return res.json(friend);
    } catch (err) {
      return next(err);
    }
  }
);

//Delete user friend.
router.delete(
  "/:username/:friendId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, friendId } = req.params;
      const response = await Friend.delete(username, friendId);
      return res.json(response);
    } catch (err) {
      return next(err);
    }
  }
);

//Update a friend.
router.patch(
  "/:username/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateFriendSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError();
      }
      const username = req.params.username;
      const id = req.params.id;
      const data = req.body;
      const message = await Friend.update(username, id, data);
      return res.json(message);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
