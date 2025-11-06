const express= require("express");
const appRouter= express.Router();

// register
appRouter.post("/register",register);

// appRouter.post("/register",function(req,res){
// })

//login
appRouter.post("/login",login);
//logout
appRouter.post("/logout",logout);
// getprofile
appRouter.post("/getProfile",getProfile);
