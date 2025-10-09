const express = require("express");
const addressRouter = express.Router();

const { createAddress,searchAddress} = require("../controllers/address-Controller");

addressRouter.post('/create-updateAddress',createAddress)
addressRouter.post('/searchAddress',searchAddress)


module.exports = addressRouter