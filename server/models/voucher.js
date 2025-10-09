const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  code: String,
  value: Number,
  isUsed: Boolean,
  startDate: String,
  validityPeriod: String,
});

const Voucher =
  mongoose.model.Voucher || mongoose.model("Voucher", VoucherSchema);

module.exports = Voucher;
