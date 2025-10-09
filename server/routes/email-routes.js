const express = require("express");
const emailRouter = express.Router();

const { Email } = require("../controllers/email-Controller");

emailRouter.post('/send-email',Email)


module.exports = emailRouter