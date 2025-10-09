require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createStripeCoupon = async (req, res, next) => {
  const { code, type, value, duration } = req.body;

  // console.log(code, type, value, duration);

  try {
    let couponData = { duration };
    couponData.name = code;
    couponData.id = code;
    if (type === "percentage") {
      couponData.percent_off = value;
    } else if (type === "fixed") {
      couponData.amount_off = Math.round(value * 100); // convert dollars to cents
      couponData.currency = "usd";
    } else {
      return res.status(400).json({ error: "Invalid coupon type" });
    }

    const coupon = await stripe.coupons.create(couponData);
    return res.json({
      success: true,
      message: "success",
      coupon,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createStripeCoupon,
};
