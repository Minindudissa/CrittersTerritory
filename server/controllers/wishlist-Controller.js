const Wishlist = require("../models/wishlist");

const createWishlist = async (req, res) => {
  const { productId, variant, multiColorColorList, userId } = req.body;

  try {
    // Create here
    const createdWishlist = await Wishlist.create({
      productId,
      variant,
      multiColorColorList,
      userId,
    });
    if (createdWishlist) {
      return res.status(201).json({
        success: true,
        message: "Added to Wishlist Successfully",
        createdWishlistData: createdWishlist,
      });
    } else {
      return res.status(201).json({
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

const searchWishlist = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isWishlistavailable = await Wishlist.find(searchData);
    if (isWishlistavailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        wishlist: isWishlistavailable,
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

const updateWishlist = async (req, res, next) => {
  const { id, updateData } = req.body;

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { _id: id }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      wishlistData: updatedWishlist,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deleteWishlist = async (req, res, next) => {
  const { deleteData } = req.body;

  try {
    const result = await Wishlist.deleteOne(deleteData);

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
  createWishlist,
  searchWishlist,
  updateWishlist,
  deleteWishlist,
};
