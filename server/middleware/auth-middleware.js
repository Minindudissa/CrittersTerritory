const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

// Utility function for timeouts
const withTimeout = (promise, timeoutMs, operation) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timeout`)), timeoutMs)
    )
  ]);
};

const userAuthVerification = async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.json({
      success: false,
      message: "Token is not available or invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY");
    
    // Validate decoded data
    if (!decoded || !decoded.getId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    const userInfo = await withTimeout(
      User.findById(decoded.getId),
      10000,
      'User database lookup'
    );

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      userInfo,
    });

  } catch (error) {
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Authentication timeout - please try again",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
};

const AdminAuthVerification = async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.json({
      success: false,
      message: "Token is not available or invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY");
    
    // Validate decoded data
    if (!decoded || !decoded.getId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    const adminInfo = await withTimeout(
      Admin.findById(decoded.getId),
      10000,
      'Admin database lookup'
    );

    if (!adminInfo) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      adminInfo,
    });

  } catch (error) {
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Authentication timeout - please try again",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Admin not authenticated",
    });
  }
};

module.exports = { userAuthVerification, AdminAuthVerification };