const express = require("express");
const voucherRouter = express.Router();

const {
  createVoucher,
  searchVoucher,
  updateVoucher,
  deleteVoucher,
} = require("../controllers/voucher-Controller");

voucherRouter.post("/createVoucher", createVoucher);
voucherRouter.post("/searchVoucher", searchVoucher);
voucherRouter.post("/updateVoucher", updateVoucher);
voucherRouter.post("/deleteVoucher", deleteVoucher);

module.exports = voucherRouter;
