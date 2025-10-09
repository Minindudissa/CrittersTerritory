const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  orderItems: Object,
  subtotal: String,
  discount: String,
  promocode_voucherCode: String,
  shipping: String,
  shippingType: String,
  orderDateTime: String,
  orderStatus: String,
  orderStatusChangedDateTime: Object,
  trackingNo: String,
  userId: String,
});

const Order = mongoose.model.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
