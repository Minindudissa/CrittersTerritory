const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: String,
  value: Number,
  isUsed: Boolean,
  startDate: String,
  endDate: String,
  userEmail: String,
});

const promoCode =
  mongoose.model.promoCode || mongoose.model("promoCode", promoCodeSchema);

module.exports = promoCode;
