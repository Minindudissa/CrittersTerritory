const joi = require("joi");
const User = require("../models/user");
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

const generateToken = (getId) => {
  return jwt.sign({ getId }, "DEFAULT_SECRET_KEY", {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  });
};

const registerUser = async (req, res, next) => {
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
    // Check if user already exists
    const isUserEmailAlreadyExists = await User.findOne({ email });
    if (isUserEmailAlreadyExists) {
      return res.json({
        success: false,
        message:
          "Email already in use. Please try again with a different email.",
        userData: {
          firstName: isUserEmailAlreadyExists.firstName,
          lastName: isUserEmailAlreadyExists.lastName,
          email: isUserEmailAlreadyExists.email,
          emailVerifiedDateTime: isUserEmailAlreadyExists.emailVerifiedDateTime,
          _id: isUserEmailAlreadyExists._id,
        },
      });
    } else {
      // Hash password and create user
      const hashPassword = await bcrypt.hash(password, 12);
      const newlyCreatedUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        mobile: "",
        genderId: "",
        emailVerifiedDateTime: "",
        accountStatus: accountStatus,
        emailVerificationCode: "",
        passwordVeriicationCode: "",
      });

      if (newlyCreatedUser) {
        const token = generateToken(newlyCreatedUser?._id);

        res.cookie("userToken", token, {
          withCredentials: true,
          httpOnly: false,
        });

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
const updateUser = async (req, res, next) => {
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
    const isUserExists = await User.findOne({ email });
    if (isUserExists?.emailVerifiedDateTime === "") {
      const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Filter by email
        {
          $set: updateData,
        }, // Update fields
        { new: true } // Return the updated document
      );
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
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Filter by email
        {
          $set: updateData,
        }, // Update fields
        { new: true } // Return the updated document
      );
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
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
const searchUser = async (req, res, next) => {
  const { searchData, pagination } = req.body;

  try {
    if (pagination) {
      const page = pagination?.page;
      const limit = pagination?.limit;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      const isUserAvailable = await User.find(searchData)
        .sort({ createdAt: -1, _id: 1 }) // Sort by newest
        .skip((pageNumber - 1) * limitNumber) // Skip previous pages
        .limit(limitNumber); // Limit number of items per page

      const totalUsers = await User.countDocuments(searchData); // Total number of items
      const totalPages = Math.ceil(totalUsers / limitNumber);

      if (isUserAvailable) {
        return res.json({
          success: true,
          message: "success",
          currentPage: pageNumber,
          totalPages,
          totalUsers,
          userData: isUserAvailable,
        });
      } else {
        return res.json({
          success: false,
          message: "Wrong Data",
          // searchData: JSON.stringify(searchData),
        });
      }
    } else {
      const isUserAvailable = await User.find(searchData);

      if (isUserAvailable) {
        return res.json({
          success: true,
          message: "success",
          userData: isUserAvailable,
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
const loginUser = async (req, res, next) => {
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
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }

    const checkAuth = await bcrypt.compare(password, getUser.password);

    if (!checkAuth) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }
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

    const token = generateToken(getUser?._id);
    res.cookie("userToken", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      success: true,
      message: "Login Success",
      userId: getUser._id,
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

const logoutUser = async (req, res) => {
  res.cookie("userToken", "", {
    withCredentials: true,
    httpOnly: false,
  });
  return res.status(200).json({
    success: true,
    message: "Log out Successfully",
  });
};

const changeUserPassword = async (req, res, next) => {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  const { error } = changeUserPasswordSchema.validate({
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
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.json({
        success: false,
        message: "Incorrect Email",
      });
    }
    if (currentPassword) {
      const checkAuth = await bcrypt.compare(currentPassword, getUser.password);
      if (!checkAuth) {
        return res.json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }

    if (newPassword === confirmPassword) {
      const newHashPassword = await bcrypt.hash(newPassword, 12);
      const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Filter by email
        {
          $set: { password: newHashPassword },
        }, // Update fields
        { new: true } // Return the updated document
      );
      const token = generateToken(updatedUser?._id);
      res.cookie("userToken", token, {
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
  registerUser,
  updateUser,
  searchUser,
  loginUser,
  logoutUser,
  changeUserPassword,
};
