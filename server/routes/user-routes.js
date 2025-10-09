const express = require("express");
const userRouter = express.Router();

const { registerUser,updateUser,searchUser,loginUser,logoutUser, changeUserPassword } = require("../controllers/user-controller");
const { userAuthVerification } = require("../middleware/auth-middleware");

userRouter.post('/register',registerUser)
userRouter.post('/update',updateUser)
userRouter.post('/search',searchUser)
userRouter.post('/login',loginUser)
userRouter.post('/auth',userAuthVerification) 
userRouter.post('/logout',logoutUser) 
userRouter.post('/changeUserPassword',changeUserPassword) 


module.exports = userRouter