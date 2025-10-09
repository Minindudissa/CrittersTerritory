const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  mobile:String,
  genderId:String,
  emailVerifiedDateTime:String,
  accountStatus:Number,
  emailVerificationCode:String,
  passwordVeriicationCode:String,
});

// Check if the model already exists to avoid re-defining it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Export the model
module.exports = User;
