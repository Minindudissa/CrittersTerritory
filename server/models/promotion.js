const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: String,
  value: Number,
  isActive: Boolean,
  startDate: String,
  endDate: String,
  categoryId: String,
  productType: String,
});

const Promotion =
  mongoose.model.Promotion || mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
