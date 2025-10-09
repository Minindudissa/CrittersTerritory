const express = require("express");
const genderRouter = express.Router();

const { searchGender } = require("../controllers/gender-Controller");

genderRouter.post('/searchGender',searchGender)


module.exports = genderRouter