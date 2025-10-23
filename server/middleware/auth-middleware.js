const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

const userAuthVerification = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.json({
      success: false,
      message: "Token is not available or invalid token",
    });
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");

      const userInfo = await User.findById(decoded.getId);
      if (userInfo) {
        return res.status(200).json({
          success: true,
          userInfo,
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
  }
};

const AdminAuthVerification = async (req, res) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return res.json({
      success: false,
      message: "Token is not available or invalid token",
    });
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");

      const adminInfo = await Admin.findById(decoded.getId);
      if (adminInfo) {
        return res.status(200).json({
          success: true,
          adminInfo,
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Admin not authenticated",
      });
    }
  }
};
module.exports = { userAuthVerification, AdminAuthVerification };
