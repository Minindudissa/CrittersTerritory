const express = require("express");
const categoryRouter = express.Router();

const {
  createCategory,
  searchCategory,
  updateCategory,
} = require("../controllers/category-Controller");

categoryRouter.post("/create", createCategory);
categoryRouter.post("/update", updateCategory);
categoryRouter.post("/search", searchCategory);

module.exports = categoryRouter;
