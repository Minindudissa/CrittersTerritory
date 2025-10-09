const express = require("express");
const newsLetterRouter = express.Router();

const { registerForNewsLetter, searchNewsLetter, updateNewsLetter } = require("../controllers/newsLetter-Controller");

newsLetterRouter.post('/registerForNewsLetter',registerForNewsLetter)
newsLetterRouter.post('/searchNewsLetter',searchNewsLetter)
newsLetterRouter.post('/updateNewsLetter',updateNewsLetter)


module.exports = newsLetterRouter