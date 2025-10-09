const express = require("express");
const promotionRouter = express.Router();

const {
  createPromotion,
  searchPromotion,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotion-Controller");

promotionRouter.post("/createPromotion", createPromotion);
promotionRouter.post("/searchPromotion", searchPromotion);
promotionRouter.post("/updatePromotion", updatePromotion);
promotionRouter.post("/deletePromotion", deletePromotion);

module.exports = promotionRouter;
