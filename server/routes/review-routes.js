const express = require("express");
const reviewRouter = express.Router();

const {
  createReview,
  searchReview,uploadReviewImages,
} = require("../controllers/review-Controller");

reviewRouter.post("/createReview", createReview);
reviewRouter.post("/searchReview", searchReview);
reviewRouter.post("/uploadReviewImages", uploadReviewImages);

module.exports = reviewRouter;
