const ProductImage = require("../models/productImage");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

let deleteContent;
let pathList = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const productType = req.body.productType || "Digital";
    const productId = req.body.productId || "default_product";
    const mainFolder = path.join(__dirname, "../Uploads", "Products");
    const productFolder = path.join(mainFolder, productType, productId);
    const imagesFolder = path.join(productFolder, "Images");

    // Create folders if they don't exist
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true });
      fs.mkdirSync(path.join(productFolder, "Files"), { recursive: true });
      fs.mkdirSync(imagesFolder, { recursive: true });
    }

    // Delete all existing files in the Images folder synchronously before uploading
    if (deleteContent && fs.existsSync(imagesFolder)) {
      const files = fs.readdirSync(imagesFolder);
      files.forEach((file) => {
        fs.unlinkSync(path.join(imagesFolder, file));
      });
      deleteContent = false;
    }

    cb(null, imagesFolder);
  },
  filename: function (req, file, cb) {
    const productId = req.body.productId || "default_product";
    const fileExtension = path.extname(file.originalname).toLowerCase();
    let fileName;

    if (fileExtension === ".mp4" || fileExtension === ".gif") {
      // Videos and GIFs are always named productId_1.mp4 or productId_1.gif
      fileName = `${productId}_1${fileExtension}`;
    } else if (file.mimetype.startsWith("image/")) {
      // Images are named with productId and incremental index (e.g., productId_1.jpg)
      if (!req.fileIndex) req.fileIndex = 1;
      fileName = `${productId}_${req.fileIndex}.jpg`; // Convert all image extensions to .jpg
      req.fileIndex++; // Increment for the next image
    } else {
      return cb(new Error("Unsupported file type"), null);
    }

    cb(null, fileName);
  },
});

const upload = multer({ storage }).array("file", 10); // Allow up to 10 files

const createProductImage = async (req, res) => {
  deleteContent = true;
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload images", error: err });
    }

    // console.log("Request body:", req.body);
    // console.log("Uploaded files:", req.files);

    const productId = req.body.productId;
    const productType = req.body.productType;

    try {
      const createdProducts = await Promise.all(
        req.files.map(async (Item) => {
          const relativePath = Item.path.split("Uploads\\").pop();
          const finalPath = "Uploads\\" + relativePath;

          pathList.push(finalPath);
        })
      );
      if (createdProducts) {
        const createdProductImage = await ProductImage.create({
          productId: productId,
          imagePath: pathList,
        });

        if (createdProductImage) {
          return res.status(201).json({
            success: true,
            message: `Products Created Successfully - ${productType}`,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "No products were created. Please try again.",
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
  });
};

const searchProductImage = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isProductImageAvailable = await ProductImage.find(searchData);
    if (isProductImageAvailable) {
      return res.status(201).json({
        success: true,
        message: "success",
        productImageList: isProductImageAvailable,
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

const updateProductImage = async (req, res) => {
  deleteContent = true;

  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({
        message: "Failed to upload images",
        error: err,
      });
    }

    const productId = req.body.productId;
    const productType = req.body.productType;

    try {
      // Convert uploaded file paths to usable format
      const pathList = req.files.map((file) => {
        const relativePath = file.path.split("Uploads\\").pop();
        return "Uploads\\" + relativePath;
      });

      // Update existing product image entry or create if not present
      const updatedImageRecord = await ProductImage.findOneAndUpdate(
        { productId },
        {
          $set: {
            imagePath: pathList,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        imagePath: updatedImageRecord.imagePath,
      });
    } catch (error) {
      console.error("Error during image update:", error.message);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while updating product images.",
      });
    }
  });
};

module.exports = {
  createProductImage,
  searchProductImage,
  updateProductImage,
};
