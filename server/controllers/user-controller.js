const joi = require("joi");
const User = require("../models/user");
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
    emailVerifiedDateTime: joi.string().allow(""),
    accountStatus: joi.number().allow(""),
    emailVerificationCode: joi.string().allow(""),
    passwordVeriicationCode: joi.string().allow(""),
  },
  email: joi.string().email().required(),
});

const changeUserPasswordSchema = joi.object({
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
const registerUser = async (req, res) => {
  console.log('🟡 REGISTER - Start');
  const { firstName, lastName, email, password } = req.body;

  // Validate input
  const { error } = registerSchema.validate({ firstName, lastName, email, password });
  if (error) {
    console.log('🔴 Register validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Checking if user exists...');
    const isUserEmailAlreadyExists = await withTimeout(
      User.findOne({ email }), 
      10000, 
      'User lookup'
    );

    if (isUserEmailAlreadyExists) {
      console.log('🔴 User already exists:', email);
      return res.json({
        success: false,
        message: "Email already in use. Please try again with a different email.",
        userData: {
          firstName: isUserEmailAlreadyExists.firstName,
          lastName: isUserEmailAlreadyExists.lastName,
          email: isUserEmailAlreadyExists.email,
          emailVerifiedDateTime: isUserEmailAlreadyExists.emailVerifiedDateTime,
          _id: isUserEmailAlreadyExists._id,
        },
      });
    }

    console.log('🟡 Hashing password...');
    const hashPassword = await withTimeout(
      bcrypt.hash(password, 10), // Reduced from 12 to 10 for performance
      15000,
      'Password hashing'
    );

    console.log('🟡 Creating user...');
    const newlyCreatedUser = await withTimeout(
      User.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        mobile: "",
        genderId: "",
        emailVerifiedDateTime: "",
        accountStatus: 1,
        emailVerificationCode: "",
        passwordVeriicationCode: "",
      }),
      15000,
      'User creation'
    );

    console.log('🟡 Generating token...');
    const token = generateToken(newlyCreatedUser._id);

    console.log('🟡 Setting cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 REGISTER SUCCESS - User:', email);
    return res.status(201).json({
      success: true,
      message: "success",
      userData: {
        firstName: newlyCreatedUser.firstName,
        lastName: newlyCreatedUser.lastName,
        email: newlyCreatedUser.email,
        _id: newlyCreatedUser._id,
      },
    });

  } catch (error) {
    console.error('🔴 REGISTER ERROR:', error.message);
    
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

const updateUser = async (req, res) => {
  console.log('🟡 UPDATE USER - Start');
  const { email, updateData } = req.body;

  // Validate input
  const { error } = updateSchema.validate({ email, updateData });
  if (error) {
    console.log('🔴 Update validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Finding user for update...');
    const isUserExists = await withTimeout(
      User.findOne({ email }),
      10000,
      'User lookup for update'
    );

    if (!isUserExists) {
      console.log('🔴 User not found for update:', email);
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    console.log('🟡 Updating user...');
    const updatedUser = await withTimeout(
      User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      ),
      15000,
      'User update'
    );

    console.log('🟢 UPDATE SUCCESS - User:', email);
    return res.status(200).json({
      success: true,
      message: "success",
      userData: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        emailVerifiedDateTime: updatedUser.emailVerifiedDateTime,
        _id: updatedUser._id,
      },
    });

  } catch (error) {
    console.error('🔴 UPDATE ERROR:', error.message);
    
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

const searchUser = async (req, res) => {
  console.log('🟡 SEARCH USER - Start');
  const { searchData, pagination } = req.body;

  try {
    if (pagination) {
      const page = parseInt(pagination?.page) || 1;
      const limit = parseInt(pagination?.limit) || 10;

      console.log('🟡 Searching users with pagination...');
      const [isUserAvailable, totalUsers] = await withTimeout(
        Promise.all([
          User.find(searchData)
            .sort({ createdAt: -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments(searchData)
        ]),
        15000,
        'User search with pagination'
      );

      const totalPages = Math.ceil(totalUsers / limit);

      console.log('🟢 SEARCH SUCCESS - Found:', isUserAvailable.length, 'users');
      return res.json({
        success: true,
        message: "success",
        currentPage: page,
        totalPages,
        totalUsers,
        userData: isUserAvailable,
      });
    } else {
      console.log('🟡 Searching users without pagination...');
      const isUserAvailable = await withTimeout(
        User.find(searchData),
        15000,
        'User search'
      );

      console.log('🟢 SEARCH SUCCESS - Found:', isUserAvailable.length, 'users');
      return res.json({
        success: true,
        message: "success",
        userData: isUserAvailable,
      });
    }
  } catch (error) {
    console.error('🔴 SEARCH ERROR:', error.message);
    
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

const loginUser = async (req, res) => {
  console.log('🟡 LOGIN - Start');
  const { email, password } = req.body;

  // Validate input
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log('🔴 Login validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Searching for user...');
    const getUser = await withTimeout(
      User.findOne({ email }),
      10000,
      'User lookup for login'
    );

    if (!getUser) {
      console.log('🔴 User not found:', email);
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    console.log('🟡 Comparing passwords...');
    const checkAuth = await withTimeout(
      bcrypt.compare(password, getUser.password),
      5000,
      'Password comparison'
    );

    if (!checkAuth) {
      console.log('🔴 Password incorrect for user:', email);
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }

    console.log('🟡 Checking account status...');
    if (getUser.accountStatus === 0) {
      return res.json({
        success: false,
        message: "Your account has been deleted",
      });
    } else if (getUser.accountStatus === 2) {
      return res.json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    console.log('🟡 Generating token...');
    const token = generateToken(getUser._id);
    
    console.log('🟡 Setting cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 LOGIN SUCCESS - User:', email);
    return res.status(200).json({
      success: true,
      message: "Login Success",
      userId: getUser._id,
    });

  } catch (error) {
    console.error('🔴 LOGIN ERROR:', error.message);
    
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

const logoutUser = async (req, res) => {
  console.log('🟡 LOGOUT - Start');
  
  res.cookie("token", "", {
    withCredentials: true,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0)
  });
  
  console.log('🟢 LOGOUT SUCCESS');
  return res.status(200).json({
    success: true,
    message: "Log out Successfully",
  });
};

const changeUserPassword = async (req, res) => {
  console.log('🟡 CHANGE PASSWORD - Start');
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  const { error } = changeUserPasswordSchema.validate({
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  });
  if (error) {
    console.log('🔴 Change password validation error:', error.details[0].message);
    return res.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    console.log('🟡 Finding user for password change...');
    const getUser = await withTimeout(
      User.findOne({ email }),
      10000,
      'User lookup for password change'
    );

    if (!getUser) {
      console.log('🔴 User not found for password change:', email);
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    if (currentPassword) {
      console.log('🟡 Verifying current password...');
      const checkAuth = await withTimeout(
        bcrypt.compare(currentPassword, getUser.password),
        5000,
        'Current password verification'
      );

      if (!checkAuth) {
        console.log('🔴 Current password incorrect for user:', email);
        return res.json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }

    if (newPassword !== confirmPassword) {
      console.log('🔴 Password confirmation mismatch for user:', email);
      return res.json({
        success: false,
        message: "Confirm Password doesn't match with New Password",
      });
    }

    console.log('🟡 Hashing new password...');
    const newHashPassword = await withTimeout(
      bcrypt.hash(newPassword, 10), // Reduced from 12 to 10
      15000,
      'New password hashing'
    );

    console.log('🟡 Updating password...');
    const updatedUser = await withTimeout(
      User.findOneAndUpdate(
        { email },
        { $set: { password: newHashPassword } },
        { new: true }
      ),
      15000,
      'Password update'
    );

    console.log('🟡 Generating new token...');
    const token = generateToken(updatedUser._id);
    
    console.log('🟡 Setting new cookie...');
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('🟢 PASSWORD CHANGE SUCCESS - User:', email);
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error('🔴 PASSWORD CHANGE ERROR:', error.message);
    
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
  registerUser,
  updateUser,
  searchUser,
  loginUser,
  logoutUser,
  changeUserPassword,
};