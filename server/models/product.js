const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productType: String,
  title: String,
  description: String,
  material: String,
  weight: String,
  printSettings: String,
  basePrice: Number,
  stockTypeId: String,
  stock: Number,
  printerTypeId: String,
  isColorFileAvailableId: String,
  categoryId: String,
  colorCount: String,
  dimension: String,
  variationsList: Object,
  variations: Object,
  sharableLink: String,
  status: String,
  totalSales: Number,
});

const Product =
  mongoose.model.Product || mongoose.model("Product", productSchema);

module.exports = Product;
