require("dotenv").config();
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

app.use(
  cors({
    origin: "https://crittersterritory.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/pageTopBanner", pageTopBannerRouter);
app.use("/api/newsLetter", newsLetterRouter);
app.use("/api/email", emailRouter);
app.use("/api/promoCode", promoCodeRouter);
app.use("/api/voucher", voucherRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/gender", genderRouter);
app.use("/api/country", countryRouter);
app.use("/api/address", addressRouter);
app.use("/api/category", categoryRouter);
app.use("/api/size", sizeRouter);
app.use("/api/color", colorRouter);
app.use("/api/product", productRouter);
app.use("/api/productImage", productImageRouter);
app.use("/api/review", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", MakePaymentRouter);
app.use("/api/coupon", StripeCouponRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/order", orderRouter);
app.use("/api/stripeCoupon", stripeCouponRouter);

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use("/api", (req, res) => {
  res.status(200).json({
    message: "Hello Express",
  });
});
app.listen(5000, () => console.log("App is now Running at Port 5000"));
