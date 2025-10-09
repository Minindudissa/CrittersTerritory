const express = require("express");
const pageTopBannerRouter = express.Router();

const { createPageTopBanner,getPageTopBanner } = require("../controllers/pageTopBanner-Controller");

pageTopBannerRouter.post('/createPageTopBanner',createPageTopBanner)
pageTopBannerRouter.get('/getPageTopBanner/:id',getPageTopBanner);


module.exports = pageTopBannerRouter