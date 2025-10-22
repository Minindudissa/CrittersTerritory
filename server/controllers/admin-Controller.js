const joi = require("joi");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Schema definitions
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
    mobile: joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(""),
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

// Utility functions
const generateToken = (getId) => {
  return jwt.sign({ getId }, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY", {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  });
};

const withTimeout = (promise, timeoutMs, operation) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Controller functions
const registerAdmin = async (req, res) => {
  console.log('🟡 ADMIN REGISTER - Start');
  const { firstName, lastName, email, password } = req.body;

  // Validate input
  const { error } = registerSchema.validate({ firstName, lastName, email, password });
  if (error) {
    console.log('🔴 Admin register validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Checking if admin exists...');
    const isAdminEmailAlreadyExists = await withTimeout(
      Admin.findOne({ email }), 
      10000, 
      'Admin lookup'
    );

    if (isAdminEmailAlreadyExists) {
      console.log('🔴 Admin already exists:', email);
      return res.json({
        success: false,
        message: "Email already in use. Please try again with a different email.",
        adminData: {
          firstName: isAdminEmailAlreadyExists.firstName,
          lastName: isAdminEmailAlreadyExists.lastName,
          email: isAdminEmailAlreadyExists.email,
          _id: isAdminEmailAlreadyExists._id,
        },
      });
    }

    console.log('🟡 Hashing password...');
    const hashPassword = await withTimeout(
      bcrypt.hash(password, 10), // Reduced from 12 to 10
      15000,
      'Admin password hashing'
    );

    console.log('🟡 Creating admin...');
    const newlyCreatedAdmin = await withTimeout(
      Admin.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        mobile: "",
        genderId: "",
        accountStatus: 1,
      }),
      15000,
      'Admin creation'
    );

    console.log('🟡 Generating token...');
    const token = generateToken(newlyCreatedAdmin._id);

    console.log('🟡 Setting cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 ADMIN REGISTER SUCCESS - Admin:', email);
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

  } catch (error) {
    console.error('🔴 ADMIN REGISTER ERROR:', error.message);
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Registration timeout - please try again",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const updateAdmin = async (req, res) => {
  console.log('🟡 UPDATE ADMIN - Start');
  const { email, updateData } = req.body;

  // Validate input
  const { error } = updateSchema.validate({ email, updateData });
  if (error) {
    console.log('🔴 Admin update validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Finding admin for update...');
    const isAdminExists = await withTimeout(
      Admin.findOne({ email }),
      10000,
      'Admin lookup for update'
    );

    if (!isAdminExists) {
      console.log('🔴 Admin not found for update:', email);
      return res.json({
        success: false,
        message: "Admin not found",
      });
    }

    console.log('🟡 Updating admin...');
    const updatedAdmin = await withTimeout(
      Admin.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      ),
      15000,
      'Admin update'
    );

    console.log('🟢 ADMIN UPDATE SUCCESS - Admin:', email);
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
    console.error('🔴 ADMIN UPDATE ERROR:', error.message);
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Update timeout - please try again",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const searchAdmin = async (req, res) => {
  console.log('🟡 SEARCH ADMIN - Start');
  const { searchData, pagination } = req.body;

  try {
    if (pagination) {
      const page = parseInt(pagination?.page) || 1;
      const limit = parseInt(pagination?.limit) || 10;

      console.log('🟡 Searching admins with pagination...');
      const [isAdminAvailable, totalAdmins] = await withTimeout(
        Promise.all([
          Admin.find(searchData)
            .sort({ createdAt: -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit),
          Admin.countDocuments(searchData)
        ]),
        15000,
        'Admin search with pagination'
      );

      const totalPages = Math.ceil(totalAdmins / limit);

      console.log('🟢 ADMIN SEARCH SUCCESS - Found:', isAdminAvailable.length, 'admins');
      return res.json({
        success: true,
        message: "success",
        currentPage: page,
        totalPages,
        totalAdmins,
        adminData: isAdminAvailable,
      });
    } else {
      console.log('🟡 Searching admins without pagination...');
      const isAdminAvailable = await withTimeout(
        Admin.find(searchData),
        15000,
        'Admin search'
      );

      console.log('🟢 ADMIN SEARCH SUCCESS - Found:', isAdminAvailable.length, 'admins');
      return res.json({
        success: true,
        message: "success",
        adminData: isAdminAvailable,
      });
    }
  } catch (error) {
    console.error('🔴 ADMIN SEARCH ERROR:', error.message);
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Search timeout - please try again",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const loginAdmin = async (req, res) => {
  console.log('🟡 ADMIN LOGIN - Start');
  const { email, password } = req.body;

  // Validate input
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log('🔴 Admin login validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Searching for admin...');
    const getAdmin = await withTimeout(
      Admin.findOne({ email }),
      10000,
      'Admin lookup for login'
    );

    if (!getAdmin) {
      console.log('🔴 Admin not found:', email);
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    console.log('🟡 Comparing passwords...');
    const checkAuth = await withTimeout(
      bcrypt.compare(password, getAdmin.password),
      5000,
      'Admin password comparison'
    );

    if (!checkAuth) {
      console.log('🔴 Password incorrect for admin:', email);
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }

    console.log('🟡 Checking account status...');
    if (getAdmin.accountStatus === 0) {
      return res.json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    console.log('🟡 Generating token...');
    const token = generateToken(getAdmin._id);
    
    console.log('🟡 Setting cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 ADMIN LOGIN SUCCESS - Admin:', email);
    return res.status(200).json({
      success: true,
      message: "Login Success",
    });

  } catch (error) {
    console.error('🔴 ADMIN LOGIN ERROR:', error.message);
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Login timeout - please try again",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const logoutAdmin = async (req, res) => {
  console.log('🟡 ADMIN LOGOUT - Start');
  
  res.cookie("token", "", {
    withCredentials: true,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0)
  });
  
  console.log('🟢 ADMIN LOGOUT SUCCESS');
  return res.status(200).json({
    success: true,
    message: "Log out Successfully",
  });
};

const changeAdminPassword = async (req, res) => {
  console.log('🟡 CHANGE ADMIN PASSWORD - Start');
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  const { error } = changeAdminPasswordSchema.validate({
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  });
  if (error) {
    console.log('🔴 Admin change password validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Finding admin for password change...');
    const getAdmin = await withTimeout(
      Admin.findOne({ email }),
      10000,
      'Admin lookup for password change'
    );

    if (!getAdmin) {
      console.log('🔴 Admin not found for password change:', email);
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    if (currentPassword) {
      console.log('🟡 Verifying current password...');
      const checkAuth = await withTimeout(
        bcrypt.compare(currentPassword, getAdmin.password),
        5000,
        'Admin current password verification'
      );

      if (!checkAuth) {
        console.log('🔴 Current password incorrect for admin:', email);
        return res.json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }

    if (newPassword !== confirmPassword) {
      console.log('🔴 Password confirmation mismatch for admin:', email);
      return res.json({
        success: false,
        message: "Confirm Password doesn't match with New Password",
      });
    }

    console.log('🟡 Hashing new password...');
    const newHashPassword = await withTimeout(
      bcrypt.hash(newPassword, 10), // Reduced from 12 to 10
      15000,
      'Admin new password hashing'
    );

    console.log('🟡 Updating password...');
    const updatedAdmin = await withTimeout(
      Admin.findOneAndUpdate(
        { email },
        { $set: { password: newHashPassword } },
        { new: true }
      ),
      15000,
      'Admin password update'
    );

    console.log('🟡 Generating new token...');
    const token = generateToken(updatedAdmin._id);
    
    console.log('🟡 Setting new cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 ADMIN PASSWORD CHANGE SUCCESS - Admin:', email);
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error('🔴 ADMIN PASSWORD CHANGE ERROR:', error.message);
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        message: "Password change timeout - please try again",
      });
    }
    
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