const mongoose = require("mongoose");

const pageTopBannerSchema = new mongoose.Schema({
  id: Number,
  bannerStatus: Boolean,
  color: String,
  text: String,
});

const pageTopBanner =
  mongoose.model.pageTopBanner ||
  mongoose.model("pageTopBanner", pageTopBannerSchema);

module.exports = pageTopBanner;
