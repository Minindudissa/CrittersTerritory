const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
  email: String,
  newsLetterStatus: Boolean,
  userId: String,
});

const newsLetter =
  mongoose.model.newsLetter ||
  mongoose.model("newsLetter", newsLetterSchema);

module.exports = newsLetter;
