const express = require("express");
const countryRouter = express.Router();

const { searchCountry } = require("../controllers/country-Controller");

countryRouter.post('/searchCountry',searchCountry)


module.exports = countryRouter