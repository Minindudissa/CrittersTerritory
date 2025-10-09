const express = require("express");
const productRouter = express.Router();

const {
  createProduct,
  searchProduct,
  RandomProductSearch,
  updateProduct
} = require("../controllers/product-Controller");

productRouter.post("/createProduct", createProduct);
productRouter.post("/searchProduct", searchProduct);
productRouter.post("/randomProductSearch", RandomProductSearch);
productRouter.post("/updateProduct", updateProduct);
// productRouter.post("/deletePromotion", deletePromotion);

module.exports = productRouter;
