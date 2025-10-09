const Gender = require("../models/gender");

const searchGender = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const genderList = await Gender.find(searchData);

    return res.json({
      success: true,
      message: "success",
      genderList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
module.exports = {
  searchGender,
};
