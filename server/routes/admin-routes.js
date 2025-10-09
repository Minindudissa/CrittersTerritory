const express = require("express");
const AdminRouter = express.Router();

const { registerAdmin,updateAdmin,searchAdmin,loginAdmin,logoutAdmin, changeAdminPassword } = require("../controllers/admin-Controller");
const { AdminAuthVerification } = require("../middleware/auth-middleware");

AdminRouter.post('/register',registerAdmin)
AdminRouter.post('/update',updateAdmin)
AdminRouter.post('/search',searchAdmin)
AdminRouter.post('/login',loginAdmin)
AdminRouter.post('/auth',AdminAuthVerification) 
AdminRouter.post('/logout',logoutAdmin) 
AdminRouter.post('/changeAdminPassword',changeAdminPassword) 


module.exports = AdminRouter