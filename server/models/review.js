const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  dateTime: String,
  review: String,
  productId: String,
  orderId: String,
  imagePath: Object,
});

const Review = mongoose.model.Review || mongoose.model("Review", reviewSchema);

module.exports = Review;
