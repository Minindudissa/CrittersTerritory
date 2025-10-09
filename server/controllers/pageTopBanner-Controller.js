const joi = require("joi");
const pageTopBanner = require("../models/pageTopBanner");

// validation Criteria
const createSchema = joi.object({
  id: joi.number().required(),
  bannerStatus: joi.boolean().required(),
  color: joi.string().required(),
  text: joi.string(),
});
// Validation Criteria

const createPageTopBanner = async (req, res) => {
  // Validation
  const { id, bannerStatus, color, text } = req.body;
  const { error } = createSchema.validate({ id, bannerStatus, color, text });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
      data:req.body
    });
  }
  // Validation

  try {
    const banner = await pageTopBanner.findOne({ id });
    if (banner) {
      // Update here
      updatedPageTopBanner = await pageTopBanner.updateOne(
        { id },
        { bannerStatus, color, text }
      );
      if (updatedPageTopBanner) {
        return res.status(201).json({
          success: true,
          message: "Banner Changed Successfully",
        });
      }
    } else {
      // Create here
      const CreatedpageTopBanner = await pageTopBanner.create({
        id,
        bannerStatus,
        color,
        text,
      });
      if (CreatedpageTopBanner) {
        return res.status(201).json({
          success: true,
          message: "Banner Changed Successfully",
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
const getPageTopBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await pageTopBanner.find({ id: id });

    if (banner) {
      return res.status(200).json({
        success: true,
        response: { banner },
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
module.exports = { createPageTopBanner, getPageTopBanner };
