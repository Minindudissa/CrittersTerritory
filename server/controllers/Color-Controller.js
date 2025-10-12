const joi = require("joi");
const Color = require("../models/color");

// validation Criteria
const createColorSchema = joi.object({
  name: joi.string().required(),
  type: joi.string().required(),
});
// Validation Criteria

const createColor = async (req, res, next) => {
  const { name, type } = req.body;

  const { error } = createColorSchema.validate({ name, type });

  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const createdColor = await Color.create({ name, status: 1, type });
    if (createdColor) {
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

const searchColor = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const colorList = await Color.find(searchData);

    return res.json({
      success: true,
      message: "success",
      colorList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const updateColor = async (req, res, next) => {
  const { _id, updateData } = req.body;

  try {
    const isColorExists = await Color.findOne({ _id });
    if (isColorExists) {
      const updatedColor = await Color.findOneAndUpdate(
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
  createColor,
  searchColor,
  updateColor,
};
