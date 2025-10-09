const joi = require("joi");
const Address = require("../models/address");

const createAddressSchema = joi.object({
  line1: joi.string().required(),
  line2: joi.string().required(),
  city: joi.string().required(),
  province: joi.string().required(),
  postalCode: joi.string().required(),
  countryId: joi.string().required(),
  userId: joi.string().required(),
});

const createAddress = async (req, res, next) => {
  const { line1, line2, city, province, postalCode, countryId, userId } =
    req.body;

  // Validate input
  const { error } = createAddressSchema.validate({
    line1,
    line2,
    city,
    province,
    postalCode,
    countryId,
    userId,
  });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const isAddressExists = await Address.findOne({ userId });
    if (isAddressExists) {
      const updatedAddress = await Address.findOneAndUpdate(
        { userId: userId },
        {
          $set: { line1, line2, city, province, postalCode, countryId, userId },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Address Updated Successfully",
      });
    } else {
      const createdAddress = await Address.create({
        line1,
        line2,
        city,
        province,
        postalCode,
        countryId,
        userId,
      });

      if (createdAddress) {
        return res.status(201).json({
          success: true,
          message: "Address Updated Successfully",
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
const searchAddress = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const isAddressAvailable = await Address.find(searchData);

    if (isAddressAvailable) {
      return res.json({
        success: true,
        message: "success",
        data: isAddressAvailable,
      });
    } else {
      return res.json({
        success: false,
        message: "Address not Found",
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
  createAddress,
  searchAddress,
};
