const express= require("express");
const authRouter= express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require("../controllers/userAuthent.js")
const userMiddleware=require("../middleware/userMiddleware")
const adminMiddleware=require("../middleware/adminMiddleware")

// register
authRouter.post("/register",register);

// appRouter.post("/register",function(req,res){
// })

//login
authRouter.post("/login",login);
//logout
authRouter.post("/logout",userMiddleware,logout);
// // getprofile
// authRouter.post("/getProfile",getProfile);
authRouter.post("/admin/register",adminMiddleware,adminRegister)
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);

module.exports=authRouter