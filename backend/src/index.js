const express= require('express');
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser = require('cookie-parser')
const authRouter= require("./routes/userAuth");

const PORT=process.env.port||5000;

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);


main()
.then(async()=>{
    app.listen(PORT,()=>{
        console.log('sever listening at port number:' + PORT);
    })
})
.catch(err=>console.log("Error Occured:"+err));
