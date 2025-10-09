const joi = require("joi");
const Category = require("../models/category");

// validation Criteria
const createCategorySchema = joi.object({
  name: joi.string().required(),
});
// Validation Criteria

const createCategory = async (req, res, next) => {
  const { name } = req.body;

  const { error } = createCategorySchema.validate({ name });

  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const createdCategory = await Category.create({ name, status: 1 });
    if (createdCategory) {
      return res.json({
        success: true,
        message: "success",
      });
    } else {
      return res.json({
        success: false,
        message: "Something went wrong. Please try again later",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const searchCategory = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const categoryList = await Category.find(searchData);

    return res.json({
      success: true,
      message: "success",
      categoryList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const updateCategory = async (req, res, next) => {
  const { _id,updateData } = req.body;

  try {
    const isCategoryExists = await Category.findOne({ _id });
    if (isCategoryExists) {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id }, // Filter by email
        {
          $set: updateData,
        }, // Update fields
        { new: true } // Return the updated document
      );
      return res.json({
        success: true,
        message: "success",
      });
    } else {
      return res.json({
        success: false,
        message: "Something went wrong. Please try again later",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = {
  createCategory,
  searchCategory,
  updateCategory,
};
