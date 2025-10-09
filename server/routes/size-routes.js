const express = require("express");
const sizeRouter = express.Router();

const {
  createSize,
  searchSize,
  updateSize,
} = require("../controllers/size-Controller");

sizeRouter.post("/create", createSize);
sizeRouter.post("/update", updateSize);
sizeRouter.post("/search", searchSize);

module.exports = sizeRouter;
