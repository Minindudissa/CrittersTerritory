const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: String,
  variant: Object,
  multiColorColorList: Object,
  quantity: Number,
  userId: String,
});

const Cart = mongoose.model.Cart || mongoose.model("Cart", cartSchema);

module.exports = Cart;
