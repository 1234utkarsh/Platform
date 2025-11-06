const validator=require("validator");

const validate=(data)=>{
    const mandatoryField=['firstName','emailId','password'];
    const isAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));// important
    if(!isAllowed){
      throw new Error("some field missing");
    }
    if(data.firstName.length<3 || data.firstName.length>20)
      throw new Error("FirstName must be between 3 and 20 characters")
    if(!validator.isEmail(data.emailId))
      throw new Error("Email format wrong");
    if(!validator.isStrongPassword(data.password))
      throw new Error("weak password");

}

module.exports=validate;