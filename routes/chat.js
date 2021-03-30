/** @format */

const express = require("express");
const router = new express.Router();
const Chat = require("../models/chat");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");



//Chat
router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const data = req.body;
    data.username = req.params.username;
    const statement = await Chat.getResponse(data);
    return res.json(statement);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;