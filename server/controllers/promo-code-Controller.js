 const promoCode = require("../models/promo-code");

const createPromoCode = async (req, res) => {
  const { code, promoValue, isUsed, startDate, endDate, userEmail } = req.body;

  try {
    const isPromoCodeAvailable = await promoCode.findOne({ code, userEmail });
     if (!isPromoCodeAvailable) {
      // Create here
      const CreatedpromoCode = await promoCode.create({
        code,
        value: promoValue,
        isUsed,
        startDate,
        endDate,
        userEmail,
      });
      if (CreatedpromoCode) {
        return res.status(201).json({
          success: true,
          message: "Promo Code Created Successfully",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const searchPromoCode = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isPromoCodesAvailable = await promoCode.find(searchData);
    if (isPromoCodesAvailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        promoCodeList: isPromoCodesAvailable,
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

const updatePromoCode = async (req, res, next) => {
  const { id, updateData } = req.body;

  try {
    const updatedPromoCode = await promoCode.findOneAndUpdate(
      { _id: id }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      promoCodeData: updatedPromoCode,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deletePromoCode = async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await promoCode.deleteOne({ _id: id });

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
  createPromoCode,
  searchPromoCode,
  updatePromoCode,
  deletePromoCode,
};
