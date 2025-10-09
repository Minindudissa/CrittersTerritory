const Order = require("../models/order");

const createOrder = async (req, res) => {
  const {
    orderId,
    orderItems,
    subtotal,
    discount,
    promocode_voucherCode,
    shipping,
    shippingType,
    orderStatus,
    userId,
  } = req.body;

  const orderDateTime = new Date().toLocaleString("en-US");
  const orderStatusChangedDateTime = "";

  try {
    // Create here
    const createdOrder = await Order.create({
      orderId,
      orderItems,
      subtotal,
      discount,
      promocode_voucherCode,
      shipping,
      shippingType,
      orderDateTime,
      orderStatus,
      orderStatusChangedDateTime,
      trackingNo: "",
      userId,
    });
    if (createdOrder) {
      return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
        createdOrderData: createdOrder,
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
const searchOrder = async (req, res) => {
  const { searchData, pagination } = req.body;

  try {
    // Find orders and sort them in descending order by createdAt and _id
    let query = Order.find(searchData).sort({ createdAt: -1, _id: -1 });

    if (pagination) {
      const { page, limit } = pagination;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Apply pagination
      query = query.skip((pageNumber - 1) * limitNumber).limit(limitNumber);

      // Count total documents matching search criteria
      const totalOrder = await Order.countDocuments(searchData);
      const totalPages = Math.ceil(totalOrder / limitNumber);

      // Fetch paginated orders
      const OrderList = await query;
      return res.status(200).json({
        success: true,
        message: "Success",
        currentPage: pageNumber,
        totalPages,
        totalOrder,
        OrderList,
      });
    } else {
      // If pagination is not provided, return all matching orders
      const OrderList = await query;
      return res.status(200).json({
        success: true,
        message: "Success",
        OrderList,
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

// const RandomOrderSearch = async (req, res) => {
//   const { searchData, pagination, randomCount } = req.body;

//   try {
//     let OrderList;
//     let totalOrder = await Order.countDocuments(searchData); // Get total Order count

//     let sampleSize = randomCount ? parseInt(randomCount, 10) : totalOrder; // Use randomCount if provided

//     if (pagination) {
//       const { page, limit } = pagination;
//       const pageNumber = parseInt(page, 10);
//       const limitNumber = parseInt(limit, 10);

//       // Ensure the sample size doesn't exceed available Orders
//       sampleSize = Math.min(sampleSize, totalOrder);

//       OrderList = await Order.aggregate([
//         { $match: searchData },
//         { $sample: { size: sampleSize } }, // Fetch dynamic random count
//         { $skip: (pageNumber - 1) * limitNumber }, // Apply pagination
//         { $limit: limitNumber },
//       ]);

//       const totalPages = Math.ceil(sampleSize / limitNumber);

//       return res.status(200).json({
//         success: true,
//         message: "Success",
//         currentPage: pageNumber,
//         totalPages,
//         totalOrder,
//         OrderList,
//       });
//     } else {
//       // If no pagination, return a random number of Orders
//       OrderList = await Order.aggregate([
//         { $match: searchData },
//         { $sample: { size: sampleSize } },
//       ]);

//       return res.status(200).json({
//         success: true,
//         message: "Success",
//         OrderList,
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

const updateOrder = async (req, res, next) => {
  const { updateSelectData, updateData } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      updateSelectData, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      OrderList: updatedOrder,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// const deletePromotion = async (req, res, next) => {
//   const { id } = req.body;

//   try {
//     const result = await Promotion.deleteOne({ _id: id });

//     if (result) {
//       return res.status(200).json({
//         success: true,
//         message: "success",
//       });
//     } else {
//       return res.json({
//         success: true,
//         message: "Something went wrong. Please try again later",
//       });
//     }
//   } catch (error) {
//     console.error("Registration Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred. Please try again later.",
//     });
//   }
// };

module.exports = {
  createOrder,
  searchOrder,
  // RandomOrderSearch,
  updateOrder,
  // deletePromotion,
};
