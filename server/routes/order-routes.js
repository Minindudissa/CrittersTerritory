const express = require("express");
const orderRouter = express.Router();

const {
  createOrder,
  searchOrder,
  // RandomOrderSearch,
  updateOrder
} = require("../controllers/order-Controller");

orderRouter.post("/createOrder", createOrder);
orderRouter.post("/searchOrder", searchOrder);
orderRouter.post("/updateOrder", updateOrder);
// orderRouter.post("/deletePromotion", deletePromotion);

module.exports = orderRouter;
