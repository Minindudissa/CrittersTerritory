const Country = require("../models/country");

const searchCountry = async (req, res, next) => {
  const {searchData} = req.body;
  

  try {
    const countryList = await Country.find(searchData);

    return res.json({
      success: true,
      message: "success",
      countryList,
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
  searchCountry,
};
 