const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema({
  gender: String,
});

const Gender =
  mongoose.model.Gender ||
  mongoose.model("Gender", genderSchema);

module.exports = Gender;
