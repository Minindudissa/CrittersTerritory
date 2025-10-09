const express = require("express");
const wishlistRouter = express.Router();

const {
  createWishlist,
  searchWishlist,
  updateWishlist,
  deleteWishlist,
} = require("../controllers/wishlist-Controller");

wishlistRouter.post("/createWishlist", createWishlist);
wishlistRouter.post("/searchWishlist", searchWishlist);
wishlistRouter.post("/updateWishlist", updateWishlist);
wishlistRouter.post("/deleteWishlist", deleteWishlist);

module.exports = wishlistRouter;
