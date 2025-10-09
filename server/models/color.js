const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: Number,
});

const Color = mongoose.model.Color || mongoose.model("Color", colorSchema);

module.exports = Color;
