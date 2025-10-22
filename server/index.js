require('dotenv').config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user-routes");
const pageTopBannerRouter = require("./routes/pageTopBanner-routes");
const newsLetterRouter = require("./routes/newsLetter-routes");
const emailRouter = require("./routes/email-routes");
const promoCodeRouter = require("./routes/promo-code-routes");
const voucherRouter = require("./routes/voucher-routes");
const promotionRouter = require("./routes/promotion-routes");
const genderRouter = require("./routes/gender-routes");
const countryRouter = require("./routes/country-routes");
const addressRouter = require("./routes/address-routes");
const adminRouter = require("./routes/admin-routes");
const categoryRouter = require("./routes/category-routes");
const sizeRouter = require("./routes/size-routes");
const colorRouter = require("./routes/color-routes");
const productRouter = require("./routes/product-routes");
const productImageRouter = require("./routes/product-image-routes");
const reviewRouter = require("./routes/review-routes");
const wishlistRouter = require("./routes/wishlist-routes");
const cartRouter = require("./routes/cart-routes");
const MakePaymentRouter = require("./routes/MakePayment-routes");
const StripeCouponRouter = require("./routes/stripeCoupon-routes");
const shippingRouter = require("./routes/shippng-routes");
const orderRouter = require("./routes/order-routes");
const stripeCouponRouter = require("./routes/stripeCoupon-routes");

require("./database");
const app = express();

// ======== ADD CORS MIDDLEWARE HERE ========
app.use(cors({
  origin: "https://crittersterritory.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// OR if you prefer the manual approach, use this instead:
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://crittersterritory.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
*/

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Your routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/pageTopBanner", pageTopBannerRouter);
// ... rest of your routes

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use("/api", (req, res) => {
  res.status(200).json({
    message: "Hello Express",
  });
});

app.listen(5000, () => console.log("App is now Running at Port 5000"));