const Cart = require("../models/cart");

const createCart = async (req, res) => {
  const { productId, variant, multiColorColorList, quantity, userId } =
    req.body;

  try {
    // Create here
    const createdCart = await Cart.create({
      productId,
      variant,
      multiColorColorList,
      quantity,
      userId,
    });
    if (createdCart) {
      return res.status(201).json({
        success: true,
        message: "Added to Cart Successfully",
        createdCartData: createdCart,
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
const searchCart = async (req, res) => {
  const { searchData } = req.body;

  try {
    const cartItems = await Cart.find(searchData);
    if (cartItems.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Cart items retrieved successfully.",
        cartList: cartItems,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No cart items found.",
        cartList: [], // Return an empty array instead of `false`
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

const updateCart = async (req, res, next) => {
  const { productId, variant, multiColorColorList, userId, updateData } =
    req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {
        productId: productId,
        variant: variant,
        ...(multiColorColorList?.length ? { multiColorColorList } : {}), // Remove if empty
        userId: userId,
      }, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      cartData: updatedCart,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const deleteCart = async (req, res, next) => {
  const { deleteData } = req.body;

  try {
    const result = await Cart.deleteMany(deleteData);

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
  createCart,
  searchCart,
  updateCart,
  deleteCart,
};
