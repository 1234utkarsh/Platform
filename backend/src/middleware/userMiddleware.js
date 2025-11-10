const jwt=require("jsonwebtoken");
const User=require("../models/user");
const redisClient=require("../config/redis");

const userMiddleware=async(req,res,next)=>{
  try{
    const {token}=req.cookies;
    if(!token)
      throw new Error("Token doesn't exist");
   const payload= jwt.verify(token,process.env.JWT_SECRET_KEY);
   console.log(payload);
   const{_id}=payload;
   if(!_id)
    throw new Error("Invalid token");

   const result=await User.findById(_id);
   if(!result)
    throw new Error("User Doesn't exist");

    // Redis ke blockList mein persent toh nahi hai
   const IsBlocked=await redisClient.exist(`token:${token}`);

   if(IsBlocked)
    throw new Error("Invalid Token");

   req.result=result;

   next();


  }catch(err){
      res.status(401).send("Error: "+ err.message)
  }
}

module.exports=userMiddleware;