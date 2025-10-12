const express = require("express");
const colorRouter = express.Router();

const {
  createColor,
  searchColor,
  updateColor,
} = require("../controllers/color-Controller");

colorRouter.post("/create", createColor);
colorRouter.post("/update", updateColor);
colorRouter.post("/search", searchColor);

module.exports = colorRouter;
