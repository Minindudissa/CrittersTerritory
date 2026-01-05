const joi = require("joi");
const Review = require("../models/review");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const createReview = async (req, res, next) => {
  const { name, rating, dateTime, review, productId, orderId } = req.body;

  try {
    const createdReview = await Review.create({
      name: name,
      rating: rating,
      dateTime: dateTime,
      review: review,
      productId: productId,
      orderId: orderId,
      imagePath: [],
    });
    if (createdReview) {
      return res.json({
        success: true,
        message: "success",
        createdReviewData: createdReview,
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

const searchReview = async (req, res, next) => {
  const { searchData } = req.body;

  try {
    const reviewList = await Review.find(searchData);

    return res.json({
      success: true,
      message: "success",
      reviewList,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// const updateColor = async (req, res, next) => {
//   const { _id, updateData } = req.body;

//   try {
//     const isColorExists = await Color.findOne({ _id });
//     if (isColorExists) {
//       const updatedColor = await Color.findOneAndUpdate(
//         { _id: _id }, // Filter by email
//         {
//           $set: updateData,
//         }, // Update fields
//         { new: true } // Return the updated document
//       );
//       return res.json({
//         success: true,
//         message: "success",
//       });
//     } else {
//       return res.json({
//         success: false,
//         message: "Something went wrong. Please try again later",
//       });
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred. Please try again later.",
//     });
//   }
// };
let reviewId = "";
// Define Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = path.join(__dirname, "../Uploads/ReviewImages");

    // Make sure the folder exists (only once)
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    reviewId = req.body.reviewId; // Make sure reviewId comes in req.body
    if (!reviewId) {
      return cb(new Error("reviewId is required"), null);
    }

    if (!req.fileIndex) req.fileIndex = 1;
    const fileName = `${reviewId}_${req.fileIndex}.webp`; // Always save as .webp
    req.fileIndex++; // Increment for next image

    cb(null, fileName);
  },
});

const upload = multer({ storage }).array("file", 2); // Allow exactly 2 images

const uploadReviewImages = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload images", error: err.message });
    }

    try {
      const uploadedFiles = req.files.map((file) => {
        const relativePath = file.path.split("Uploads\\").pop();
        return "Uploads/" + relativePath.replace(/\\/g, "/"); // Use forward slashes
      });

      const updatedColor = await Review.findOneAndUpdate(
        { _id: reviewId }, // Filter by email
        {
          $set: { imagePath: uploadedFiles },
        }, // Update fields
        { new: true } // Return the updated document
      );
      if (updatedColor) {
        return res.status(201).json({
          success: true,
          message: "Images uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  });
};

module.exports = {
  createReview,
  searchReview,
  uploadReviewImages,
  // updateColor,
};
