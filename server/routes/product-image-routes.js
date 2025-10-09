const express = require("express");
const productImageRouter = express.Router();

const {
  createProductImage,
  searchProductImage,
  updateProductImage,
} = require("../controllers/product-image-Controller");

productImageRouter.post("/createProductImage", createProductImage);
productImageRouter.post("/searchProductImage", searchProductImage);
productImageRouter.post("/updateProductImage", updateProductImage);
// productImageRouter.post("/deletePromotion", deletePromotion);

module.exports = productImageRouter;
