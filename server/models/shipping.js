 const mongoose = require("mongoose");

const shippingDataSchema = new mongoose.Schema({
  shippingType: String,
  weightBelow: String,
  maxProductWeight: String,
  price: String,
  status: String,
});

const shipping =
  mongoose.model.shipping ||
  mongoose.model("shipping", shippingDataSchema);

module.exports = shipping;
