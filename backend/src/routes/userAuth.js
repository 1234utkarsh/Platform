const express= require("express");
const authRouter= express.Router();
const {register,login}=require("../controllers/userAuthent")

// register
authRouter.post("/register",register);

// appRouter.post("/register",function(req,res){
// })

//login
authRouter.post("/login",login);
//logout
// authRouter.post("/logout",logout);
// // getprofile
// authRouter.post("/getProfile",getProfile);

module.exports=authRouter