const express = require("express");
const promoCodeRouter = express.Router();

const { createPromoCode,searchPromoCode,updatePromoCode,deletePromoCode } = require("../controllers/promo-code-Controller");

promoCodeRouter.post('/createPromo',createPromoCode)
promoCodeRouter.post('/searchPromo',searchPromoCode)
promoCodeRouter.post('/updatePromo',updatePromoCode)
promoCodeRouter.post('/deletePromo',deletePromoCode)


module.exports = promoCodeRouter