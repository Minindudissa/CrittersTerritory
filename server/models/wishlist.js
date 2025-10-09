const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  productId: String,
  variant: Object,
  multiColorColorList: Object,
  userId: String,
});

const wishList =
  mongoose.model.wishList || mongoose.model("wishList", wishListSchema);

module.exports = wishList;
