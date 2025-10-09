const shippingData = require("../models/shipping");

const createShippingData = async (req, res) => {
  const {
    addShippingType,
    addShippingWeightBelow,
    addMaxProductWeight,
    addShippingPrice,
    status,
  } = req.body;

  try {
    const isShippingDataAvailable = await shippingData.findOne({
      shippingType: addShippingType,
      weightBelow: addShippingWeightBelow,
      maxProductWeight: addMaxProductWeight,
      price: addShippingPrice,
    });
    if (!isShippingDataAvailable) {
      // Create here
      const CreatedShippingData = await shippingData.create({
        shippingType: addShippingType,
        weightBelow: addShippingWeightBelow,
        maxProductWeight: addMaxProductWeight,
        price: addShippingPrice,
        status: status,
      });
      if (CreatedShippingData) {
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

const searchShippingData = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isShippingDatasAvailable = await shippingData
      .find(searchData)
      .sort({ createdAt: -1 });
    if (isShippingDatasAvailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        shippingDataList: isShippingDatasAvailable,
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

const updateShippingData = async (req, res, next) => {
  const { id, updateData } = req.body;

  try {
    const updatedShippingData = await shippingData.findOneAndUpdate(
      { _id: id }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      shippingData: updatedShippingData,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deleteShippingData = async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await shippingData.deleteOne({ _id: id });

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
  createShippingData,
  searchShippingData,
  updateShippingData,
  deleteShippingData,
};
