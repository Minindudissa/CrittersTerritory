const Voucher = require("../models/voucher");

const createVoucher = async (req, res) => {
  const { code, VoucherValue, isUsed, startDate, validityPeriod, } =
    req.body;

  try {
    const isVoucherAvailable = await Voucher.findOne({ code, });
    if (!isVoucherAvailable) {
      // Create here
      const createdVoucher = await Voucher.create({
        code,
        value: VoucherValue,
        isUsed,
        startDate,
        validityPeriod,
      });
      if (createdVoucher) {
        return res.status(201).json({
          success: true,
          message: "Voucher Created Successfully",
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

const searchVoucher = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isVoucherAvailable = await Voucher.find(searchData);
    if (isVoucherAvailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        voucherList: isVoucherAvailable,
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

const updateVoucher = async (req, res, next) => {
  const { id, updateData } = req.body;

  try {
    const updatedVoucher = await Voucher.findOneAndUpdate(
      { _id: id }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      voucherData: updatedVoucher,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deleteVoucher = async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await Voucher.deleteOne({ _id: id });

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
  createVoucher,
  searchVoucher,
  updateVoucher,
  deleteVoucher,
};
