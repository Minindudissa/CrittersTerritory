const joi = require("joi");
const newsLetter = require("../models/newsLetter");

// validation Criteria
const createSchema = joi.object({
  email: joi.string().required().email(),
  newsLetterStatus: joi.boolean().required(),
  userId: joi.string().default("").allow(""),
});
// Validation Criteria

const registerForNewsLetter = async (req, res) => {
  // Validation
  const { email, newsLetterStatus, userId } = req.body;
  const { error } = createSchema.validate({ email, newsLetterStatus, userId });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }
  // Validation
 
  try { 
    const registeredForNewsLetter = await newsLetter.findOne({ email });
    if (registeredForNewsLetter) {
      return res.status(201).json({
        success: true,
        message: "You have already registered to our newsletters !",
      }); 
    } else {
      // Create here
      const registerForNewsLetter = await newsLetter.create({
        email,
        newsLetterStatus,
        userId,
      });
      if (registerForNewsLetter) {
        return res.status(201).json({
          success: true,
          message: "You have successfully registered to our newsletters !",
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

const searchNewsLetter = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const newsLetterList = await newsLetter.find(searchData);

    return res.json({
      success: true,
      message: "success",
      newsLetterList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const updateNewsLetter = async (req, res, next) => {
  const { userId, updateData } = req.body;

  try {
    const updatedNewsLetter = await newsLetter.findOneAndUpdate(
      { userId: userId }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      newsLetterData: updatedNewsLetter,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = { registerForNewsLetter,searchNewsLetter,updateNewsLetter};
