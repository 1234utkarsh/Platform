const express= require('express');
const app=express();
require('dotenv').config();
const main=require('./config/db')

const PORT=process.env.port||5000;

app.use(express.json());


main()
.then(async()=>{
    app.listen(PORT,()=>{
        console.log('sever listening at port number:' + PORT);
    })
})
.catch(err=>console.log("Error Occured:"+err));
