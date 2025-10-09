const express = require("express");
const MakePaymentRouter = express.Router();

const { makePaymentStripe } = require("../controllers/MakePayment-Controller");

MakePaymentRouter.post("/create-checkout-session", makePaymentStripe);

module.exports = MakePaymentRouter;
