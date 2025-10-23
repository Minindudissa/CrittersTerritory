const ProductImage = require("../models/productImage");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const productType = req.body.productType || "Digital";
      const productId = req.body.productId || "default_product";
      
      if (!productId || productId === "default_product") {
        return cb(new Error("Product ID is required"), null);
      }
      
      // Use path.join for cross-platform compatibility
      const mainFolder = path.join(__dirname, "../Uploads", "Products");
      const productFolder = path.join(mainFolder, productType, productId);
      const imagesFolder = path.join(productFolder, "Images");

      // Create folders if they don't exist
      if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder, { recursive: true });
      }

      // Check if we need to delete existing content (only for updates)
      const shouldDeleteContent = req.body.deleteExisting === "true";
      if (shouldDeleteContent && fs.existsSync(imagesFolder)) {
        try {
          const files = fs.readdirSync(imagesFolder);
          files.forEach((file) => {
            const filePath = path.join(imagesFolder, file);
            // Only delete files, not directories
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          });
        } catch (error) {
          console.error("Error deleting existing files:", error);
        }
      }

      cb(null, imagesFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    try {
      const productId = req.body.productId || "default_product";
      const fileExtension = path.extname(file.originalname).toLowerCase();
      let fileName;

      // Initialize file index if not exists
      if (!req.fileIndexMap) {
        req.fileIndexMap = new Map();
      }
      
      if (!req.fileIndexMap.has(productId)) {
        req.fileIndexMap.set(productId, 1);
      }

      const currentIndex = req.fileIndexMap.get(productId);

      if (fileExtension === ".mp4" || fileExtension === ".gif") {
        fileName = `${productId}_1${fileExtension}`;
      } else if (file.mimetype.startsWith("image/")) {
        fileName = `${productId}_${currentIndex}${fileExtension}`;
        req.fileIndexMap.set(productId, currentIndex + 1);
      } else {
        return cb(new Error("Unsupported file type"), null);
      }

      cb(null, fileName);
    } catch (error) {
      cb(error, null);
    }
  },
});

// Create multer instance with proper error handling
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // Maximum 10 files
  },
  fileFilter: function (req, file, cb) {
    // Check file types
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'video/mp4' || 
        file.mimetype === 'image/gif') {
      cb(null, true);
    } else {
      cb(new Error('Only images, MP4 videos, and GIFs are allowed'), false);
    }
  }
}).array("file", 10); // "file" should match your frontend field name

const createProductImage = async (req, res) => {
  // Reset file index for this request
  req.fileIndexMap = new Map();
  
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      
      // Handle specific multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: "File too large. Maximum size is 50MB per file."
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(413).json({
          success: false,
          message: "Too many files. Maximum 10 files allowed."
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Failed to upload images", 
        error: err.message 
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const productId = req.body.productId;
    const productType = req.body.productType;

    // Validate required fields
    if (!productId) {
      // Clean up uploaded files if validation fails
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      });
      
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    try {
      // Process uploaded files
      const pathList = req.files.map((file) => {
        // Use cross-platform path handling
        const fullPath = file.path;
        const normalizedPath = fullPath.split(path.sep).join('/');
        const uploadsIndex = normalizedPath.indexOf('Uploads/');
        
        if (uploadsIndex !== -1) {
          return normalizedPath.substring(uploadsIndex);
        }
        
        // Fallback: just use the relative path from Uploads
        const relativePath = path.relative(path.join(__dirname, '../Uploads'), fullPath);
        return 'Uploads/' + relativePath.split(path.sep).join('/');
      });

      // Create product image record
      const createdProductImage = await ProductImage.create({
        productId: productId,
        imagePath: pathList,
      });

      return res.status(201).json({
        success: true,
        message: `Product images created successfully - ${productType}`,
        data: {
          productId: productId,
          imagePaths: pathList,
          imageCount: pathList.length
        }
      });

    } catch (error) {
      console.error("Database error:", error.message);
      
      // Clean up uploaded files if database operation fails
      if (req.files) {
        req.files.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (cleanupError) {
            console.error("Error cleaning up file:", cleanupError);
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};

const searchProductImage = async (req, res) => {
  const { searchData } = req.body;

  try {
    const isProductImageAvailable = await ProductImage.find(searchData || {});
    
    return res.status(200).json({
      success: true,
      message: "success",
      productImageList: isProductImageAvailable,
      count: isProductImageAvailable.length
    });
    
  } catch (error) {
    console.error("Search error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while searching product images.",
    });
  }
};

const updateProductImage = async (req, res) => {
  // Reset file index for this request
  req.fileIndexMap = new Map();
  
  // Set flag to delete existing content
  req.body.deleteExisting = "true";
  
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: "File too large. Maximum size is 50MB per file."
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Failed to upload images",
        error: err.message,
      });
    }

    const productId = req.body.productId;
    const productType = req.body.productType;

    // Validate required fields
    if (!productId) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (cleanupError) {
            console.error("Error cleaning up file:", cleanupError);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    try {
      // Process uploaded file paths
      const pathList = req.files ? req.files.map((file) => {
        const fullPath = file.path;
        const normalizedPath = fullPath.split(path.sep).join('/');
        const uploadsIndex = normalizedPath.indexOf('Uploads/');
        
        if (uploadsIndex !== -1) {
          return normalizedPath.substring(uploadsIndex);
        }
        
        const relativePath = path.relative(path.join(__dirname, '../Uploads'), fullPath);
        return 'Uploads/' + relativePath.split(path.sep).join('/');
      }) : [];

      // Update or create product image record
      const updatedImageRecord = await ProductImage.findOneAndUpdate(
        { productId },
        {
          $set: {
            imagePath: pathList,
            updatedAt: new Date()
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        message: "Product images updated successfully",
        data: {
          productId: productId,
          imagePaths: updatedImageRecord.imagePath,
          imageCount: pathList.length
        }
      });
      
    } catch (error) {
      console.error("Error during image update:", error.message);
      
      // Clean up files if database operation fails
      if (req.files) {
        req.files.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (cleanupError) {
            console.error("Error cleaning up file:", cleanupError);
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while updating product images.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};

module.exports = {
  createProductImage,
  searchProductImage,
  updateProductImage,
};