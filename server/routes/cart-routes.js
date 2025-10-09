const express = require("express");
const cartRouter = express.Router();

const {
  createCart,
  searchCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart-Controller");

cartRouter.post("/createCart", createCart);
cartRouter.post("/searchCart", searchCart);
cartRouter.post("/updateCart", updateCart);
cartRouter.post("/deleteCart", deleteCart);

module.exports = cartRouter;
