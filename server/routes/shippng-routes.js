const express = require("express");
const shippingRouter = express.Router();

const {
  createShippingData,
  searchShippingData,
  updateShippingData,
  deleteShippingData,
} = require("../controllers/shipping-Controller");

shippingRouter.post("/createShippingData", createShippingData);
shippingRouter.post("/searchShippingData", searchShippingData);
shippingRouter.post("/updateShippingData", updateShippingData);
shippingRouter.post("/deleteShippingData", deleteShippingData);

module.exports = shippingRouter;
