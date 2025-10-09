const Promotion = require("../models/promotion");

const createPromotion = async (req, res) => {
  const { title, promotionValue, isActive, startDate, endDate, categoryId,productType } =
    req.body;

  try {
    // Create here
    const createdPromotion = await Promotion.create({
      title,
      value: promotionValue,
      isActive,
      startDate,
      endDate,
      categoryId,
      productType,
    });
    if (createdPromotion) {
      return res.status(201).json({
        success: true,
        message: "Promotion Created Successfully",
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

const searchPromotion = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isPromotionAvailable = await Promotion.find(searchData);
    if (isPromotionAvailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        promotionList: isPromotionAvailable,
      });
    } else {
      return res.json({
        success: false,
        message: "Something went wrong",
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

const updatePromotion = async (req, res, next) => {
  const { id, updateData } = req.body;

  try {
    const updatedPromotion = await Promotion.findOneAndUpdate(
      { _id: id }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      promotionData: updatedPromotion,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deletePromotion = async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await Promotion.deleteOne({ _id: id });

    if (result) {
      return res.status(200).json({
        success: true,
        message: "success",
      });
    } else {
      return res.json({
        success: true,
        message: "Something went wrong. Please try again later",
      });
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = {
  createPromotion,
  searchPromotion,
  updatePromotion,
  deletePromotion,
};
