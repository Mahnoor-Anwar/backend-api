import express from 'express'
import mongoose from 'mongoose'
import UserModal from './modals/UserSchema.js';
import bcrypt from "bcryptjs"; 
import "dotenv/config";  

let data = express()

const DBURI="mongodb+srv://mahnoor:mahnoor@cluster0.ea4a1.mongodb.net/";
data.use(express.json())
data.use(express.urlencoded({ extended: true }))

mongoose.connect(DBURI);
mongoose.connection.on("connected",()=>{
    console.log("database connected");
})
mongoose.connection.on("error",(err)=>{
    console.log(err);
})


data.post('/api/signup',async(req, res)=>{
    const {name, email , password} = req.body;
    if (!name ||!email || !password) {
           res.json({
             message: "required fields are missing",
             status: false,
           });
           return;
         }
    const alreadyExistEmail = await UserModal.findOne({email})
    if (alreadyExistEmail !== null) {
        res.json({
          message: "email already been registered",
          status: false,
        });
    
        return;
      }

      const passwordBcrypt = await bcrypt.hash(password, 10)
    const userObj = {
        name,
        email,
        password:passwordBcrypt,
    }
    
    const createUser = await UserModal.create(userObj)
    res.json({
        message:"User created Successfully",
        status:true
    })

})

data.post('/api/login',async(req, res)=>{
    const { email , password} = req.body;
    const findEmail = await UserModal.findOne({ email });

    if (!findEmail) {
      res.json({
        message: "Invalid email & password",
        status: false,
      });
      return;
    }
    if(!email || !password){
        res.json({
            message:"Required Fields are missing",
            status:false
        })
    }

    const comparePassword = await bcrypt.compare(password, findEmail.password)
    if(!comparePassword) {
        res.json({
            message:'Invalid Email or Password',
            status:false
        })
        return;
    }
    res.json({
        message:"User logged in Successfully",
        status:true
    })
  
})
data.listen(7890,()=>{
    console.log("my server running")
})