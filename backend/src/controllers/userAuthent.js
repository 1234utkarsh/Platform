const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient=require("../config/redis");

const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    // check if emailId already exist
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // create user

    const user = await User.create(req.body);
    req.body.password = await bcrypt.hash(password, 10);

    // give jwt token to user
    const token = jwt.sign({ id:user._id,emailId:emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60,
    });
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status.send("user registered successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const login=async(req,res)=>{
   try{
      const{emailId,password}=req.body;
      if(!emailId)
         throw new Error("Invalid Credentials")
      if(!password)
         throw new Error("Invalid Credentials")
      const user=await User.findOne({emailId})
      if(!user)
         throw new Error("you are not registered . please registered.")
     const match= bcrypt.compare(password,user.password)
     if(!match)
      throw new Error("Invalid Credentials");
   const token=jwt.sign({id:user._id, emailId:emailId},process.env.JWT_SECRET_KEY,{expiresIn:60*60})
   res.cookie('token',token,{maxAge:60*60*1000})
   res.status(200).send("logged in successfully")
   }catch(err){
res.status(401).send("Error:"+err)
   }
}

const logout=async(req,res)=>{
   try{
      // validate the token (done)
   const {token}=req.cookies;
   const payload=jwt.decode(token);
   await redisClient.set(`token:${token}`,'Blocked');
   await redisClient.expireAt(`token:${token}`,payload.exp);
   // add token into the redis blocklist
   // cookies clear kar dena
   res.cookie("token",null,{expires:new Date(Date.now())});
   res.send("Logged Out Successfully");
   }catch(err){
      res.status(503).send("Error: "+err);
   }
}

module.exports={register,login,logout};
