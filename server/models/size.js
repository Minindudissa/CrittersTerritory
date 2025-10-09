const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  name: String,
  status: Number,
});

const Size =
  mongoose.model.Size || mongoose.model("Size", sizeSchema);

module.exports = Size;
