const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

// Utility: send standardized JSON response
const sendResponse = (res, status, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// User authentication middleware
const userAuthVerification = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return sendResponse(res, 401, false, "Token not available or invalid");

    const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");

    const userInfo = await User.findById(decoded.getId).lean();
    if (!userInfo) return sendResponse(res, 404, false, "User not found");

    return sendResponse(res, 200, true, "User authenticated", userInfo);
  } catch (err) {
    // Handle JWT errors separately for clarity
    if (err.name === "TokenExpiredError") {
      return sendResponse(res, 401, false, "Token expired");
    }
    if (err.name === "JsonWebTokenError") {
      return sendResponse(res, 401, false, "Invalid token");
    }

    console.error("User Auth Error:", err);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

// Admin authentication middleware
const adminAuthVerification = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return sendResponse(res, 401, false, "Token not available or invalid");

    const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");

    const adminInfo = await Admin.findById(decoded.getId).lean();
    if (!adminInfo) return sendResponse(res, 404, false, "Admin not found");

    return sendResponse(res, 200, true, "Admin authenticated", adminInfo);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendResponse(res, 401, false, "Token expired");
    }
    if (err.name === "JsonWebTokenError") {
      return sendResponse(res, 401, false, "Invalid token");
    }

    console.error("Admin Auth Error:", err);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = { userAuthVerification, adminAuthVerification };
