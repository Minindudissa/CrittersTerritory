const Product = require("../models/product");

const createProduct = async (req, res) => {
  const {
    productType,
    title,
    description,
    material,
    weight,
    printSettings,
    basePrice,
    stockTypeId,
    stock,
    printerTypeId,
    isColorFileAvailableId,
    categoryId,
    colorCount,
    dimension,
    variationsList,
    variations,
    sharableLink,
  } = req.body;

  try {
    // Create here
    const createdProduct = await Product.create({
      productType,
      title,
      description,
      material,
      weight,
      printSettings,
      basePrice,
      stockTypeId,
      stock,
      printerTypeId,
      isColorFileAvailableId,
      categoryId,
      colorCount,
      dimension,
      variationsList,
      variations,
      sharableLink,
      status: "1",
      totalSales: 0,
    });
    if (createdProduct) {
      return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        createdProductData: createdProduct,
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
const searchProduct = async (req, res) => {
  const { searchData, pagination } = req.body;

  try {
    // Descending sort: newest first
    let query = Product.find(searchData).sort({ createdAt: -1, _id: -1 });

    if (pagination) {
      const { page, limit } = pagination;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Apply pagination
      query = query.skip((pageNumber - 1) * limitNumber).limit(limitNumber);

      // Count total products for pagination info
      const totalProduct = await Product.countDocuments(searchData);
      const totalPages = Math.ceil(totalProduct / limitNumber);

      // Execute the query
      const productList = await query;
      return res.status(200).json({
        success: true,
        message: "Success",
        currentPage: pageNumber,
        totalPages,
        totalProduct,
        productList,
      });
    } else {
      // No pagination: return full result
      const productList = await query;
      return res.status(200).json({
        success: true,
        message: "Success",
        productList,
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

const RandomProductSearch = async (req, res) => {
  const { searchData, pagination, randomCount } = req.body;

  try {
    let productList;
    let totalProduct = await Product.countDocuments(searchData); // Get total product count

    let sampleSize = randomCount ? parseInt(randomCount, 10) : totalProduct; // Use randomCount if provided

    if (pagination) {
      const { page, limit } = pagination;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Ensure the sample size doesn't exceed available products
      sampleSize = Math.min(sampleSize, totalProduct);

      productList = await Product.aggregate([
        { $match: searchData },
        { $sample: { size: sampleSize } }, // Fetch dynamic random count
        { $skip: (pageNumber - 1) * limitNumber }, // Apply pagination
        { $limit: limitNumber },
      ]);

      const totalPages = Math.ceil(sampleSize / limitNumber);

      return res.status(200).json({
        success: true,
        message: "Success",
        currentPage: pageNumber,
        totalPages,
        totalProduct,
        productList,
      });
    } else {
      // If no pagination, return a random number of products
      productList = await Product.aggregate([
        { $match: searchData },
        { $sample: { size: sampleSize } },
      ]);

      return res.status(200).json({
        success: true,
        message: "Success",
        productList,
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

const updateProduct = async (req, res, next) => {
  const { updateSelectData, updateData } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      updateSelectData, // Filter by id
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      productList: updatedProduct,
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
  createProduct,
  searchProduct,
  RandomProductSearch,
  updateProduct,
  // deletePromotion,
};
