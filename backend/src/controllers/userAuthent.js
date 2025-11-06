const User=require("../models/user");
const validate=require("../utils/validate");
const bcrypt= require("bcrypt");

const register= async(req,res)=>{
  try{
        validate(req.body);
  const{firstName,emailId,password}=req.body;
  // check if emailId already exist
  const existingUser= await User.findOne({emailId});
  if(existingUser){
     return res.status(400).json({message:"Email already exists"});
  }
  // create user
 
  const user= await User.create(req.body);
  req.body.password= await bcrypt.hash(password,10);

  // give jwt token to user
  

  }catch(err){
     res.status(400).send("Error: "+err);
  }
 
}



      