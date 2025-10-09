const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  province: String,
  postalCode: String,
  countryId: String,
  userId: String,
});

const Address =
  mongoose.model.Address ||
  mongoose.model("Address", addressSchema);

module.exports = Address;
