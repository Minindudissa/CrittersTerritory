const joi = require("joi");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const updateSchema = joi.object({
  updateData: {
    firstName: joi.string(),
    lastName: joi.string(),
    password: joi.string().min(8).allow(""),
    mobile: joi
      .string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .allow(""),
    genderId: joi.string().default("0").allow(""),
    accountStatus: joi.number().allow(""),
  },
  email: joi.string().email().required(),
});

const changeAdminPasswordSchema = joi.object({
  currentPassword: joi.string().allow(""),
  newPassword: joi.string().min(8),
  confirmPassword: joi.string(),
  email: joi.string().email().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const generateToken = (getId) => {
  return jwt.sign({ getId }, "DEFAULT_SECRET_KEY", {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  });
};

const registerAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const accountStatus = 1;

  // Validate input
  const { error } = registerSchema.validate({
    firstName,
    lastName,
    email,
    password,
  });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    // Check if Admin already exists
    const isAdminEmailAlreadyExists = await Admin.findOne({ email });
    if (isAdminEmailAlreadyExists) {
      return res.json({
        success: false,
        message:
          "Email already in use. Please try again with a different email.",
        adminData: {
          firstName: isAdminEmailAlreadyExists.firstName,
          lastName: isAdminEmailAlreadyExists.lastName,
          email: isAdminEmailAlreadyExists.email,
          _id: isAdminEmailAlreadyExists._id,
        },
      });
    } else {
      // Hash password and create Admin
      const hashPassword = await bcrypt.hash(password, 12);
      const newlyCreatedAdmin = await Admin.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        mobile: "",
        genderId: "",
        accountStatus: accountStatus,
      });

      if (newlyCreatedAdmin) {
        const token = generateToken(newlyCreatedAdmin?._id);

        res.cookie("adminToken", token, {
          withCredentials: true,
          httpOnly: false,
        });

        return res.status(201).json({
          success: true,
          message: "success",
          adminData: {
            firstName: newlyCreatedAdmin.firstName,
            lastName: newlyCreatedAdmin.lastName,
            email: newlyCreatedAdmin.email,
            _id: newlyCreatedAdmin._id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
const updateAdmin = async (req, res, next) => {
  const { email, updateData } = req.body;

  // Validate input
  const { error } = updateSchema.validate({
    email,
    updateData,
  });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const isAdminExists = await Admin.findOne({ email });
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email: email }, // Filter by email
      {
        $set: updateData,
      }, // Update fields
      { new: true } // Return the updated document
    );
    return res.status(200).json({
      success: true,
      message: "success",
      adminData: {
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
        email: updatedAdmin.email,
        _id: updatedAdmin._id,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
const searchAdmin = async (req, res, next) => {
  const { searchData, pagination } = req.body;

  try {
    if (pagination) {
      const page = pagination?.page;
      const limit = pagination?.limit;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      const isAdminAvailable = await Admin.find(searchData)
        .sort({ createdAt: -1, _id: 1 }) // Sort by newest
        .skip((pageNumber - 1) * limitNumber) // Skip previous pages
        .limit(limitNumber); // Limit number of items per page

      const totalAdmins = await Admin.countDocuments(searchData); // Total number of items
      const totalPages = Math.ceil(totalAdmins / limitNumber);

      if (isAdminAvailable) {
        return res.json({
          success: true,
          message: "success",
          currentPage: pageNumber,
          totalPages,
          totalAdmins,
          adminData: isAdminAvailable,
        });
      } else {
        return res.json({
          success: false,
          message: "Wrong Data",
          // searchData: JSON.stringify(searchData),
        });
      }
    } else {
      const isAdminAvailable = await Admin.find(searchData);

      if (isAdminAvailable) {
        return res.json({
          success: true,
          message: "success",
          adminData: isAdminAvailable,
        });
      } else {
        return res.json({
          success: false,
          message: "Wrong Data",
          // searchData: JSON.stringify(searchData),
        });
      }
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  const { error } = loginSchema.validate({
    email,
    password,
  });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const getAdmin = await Admin.findOne({ email });
    if (!getAdmin) {
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    const checkAuth = await bcrypt.compare(password, getAdmin.password);

    if (!checkAuth) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }
    if (getAdmin.accountStatus === 0) {
      return res.json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    const token = generateToken(getAdmin?._id);
    res.cookie("adminToken", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      success: true,
      message: "Login Success",
    });
    next();
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const logoutAdmin = async (req, res) => {
  res.cookie("adminToken", "", {
    withCredentials: true,
    httpOnly: false,
  });
  return res.status(200).json({
    success: true,
    message: "Log out Successfully",
  });
};

const changeAdminPassword = async (req, res, next) => {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  const { error } = changeAdminPasswordSchema.validate({
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  });
  if (error) {
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const getAdmin = await Admin.findOne({ email });
    if (!getAdmin) {
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }
    if (currentPassword) {
      const checkAuth = await bcrypt.compare(
        currentPassword,
        getAdmin.password
      );
      if (!checkAuth) {
        return res.json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }

    if (newPassword === confirmPassword) {
      const newHashPassword = await bcrypt.hash(newPassword, 12);
      const updatedAdmin = await Admin.findOneAndUpdate(
        { email: email }, // Filter by email
        {
          $set: { password: newHashPassword },
        }, // Update fields
        { new: true } // Return the updated document
      );
      const token = generateToken(updatedAdmin?._id);
      res.cookie("adminToken", token, {
        withCredentials: true,
        httpOnly: false,
      });

      res.status(201).json({
        success: true,
        message: "updated",
      });
    } else {
      return res.json({
        success: false,
        message: "Confirm Password doesn't match with New Password",
      });
    }

    next();
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = {
  registerAdmin,
  updateAdmin,
  searchAdmin,
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
};
