const express = require("express");
const stripeCouponRouter = express.Router();

const { createStripeCoupon } = require("../controllers/stripeCoupon-Controller");

stripeCouponRouter.post("/createStripeCoupon", createStripeCoupon);

module.exports = stripeCouponRouter;
