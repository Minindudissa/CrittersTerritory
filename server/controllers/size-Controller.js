const joi = require("joi");
const Size = require("../models/size");

// validation Criteria
const createSizeSchema = joi.object({
  name: joi.string().required(),
});
// Validation Criteria

const createSize = async (req, res, next) => {
  const { name } = req.body;

  const { error } = createSizeSchema.validate({ name });

  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const createdSize = await Size.create({ name, status: 1 });
    if (createdSize) {
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

const searchSize = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const sizeList = await Size.find(searchData);

    return res.json({
      success: true,
      message: "success",
      sizeList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const updateSize = async (req, res, next) => {
  const { _id,updateData } = req.body;

  try {
    const isSizeExists = await Size.findOne({ _id });
    if (isSizeExists) {
      const updatedSize = await Size.findOneAndUpdate(
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
  createSize,
  searchSize,
  updateSize,
};
