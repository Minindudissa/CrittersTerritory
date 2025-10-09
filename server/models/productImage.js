const mongoose = require("mongoose");

const productImagesSchema = new mongoose.Schema({
  productId: String,
  imagePath: Object,
});

const ProductImages =
  mongoose.model.ProductImages || mongoose.model("ProductImages", productImagesSchema);

module.exports = ProductImages;
