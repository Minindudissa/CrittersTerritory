const mongoose = require("mongoose");

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  mobile:String,
  genderId:String,
  accountStatus:Number,
});

// Check if the model already exists to avoid re-defining it
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// Export the model
module.exports = Admin;
[{
  "firstName": "Rashmi",
  "lastName": "Ama",
  "email": "amarashmi21@gmail.com",
  "password": "123456789",
  "mobile":"",
  "genderId":"",
  "accountStatus":1,
}]