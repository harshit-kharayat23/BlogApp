const express=require("express");
const bcrpyt=require("bcrypt")
const userAuthRouter=express.Router();
const User=require("../models/userModel");
const validate = require("../utils/validation");
const jwt=require("jsonwebtoken");
const {auth,isStudent,isAdmin}=require("../middlewares/auth")

userAuthRouter.post("/signup",async(req,res)=>{

    try{
         // validation of req.body
        validate(req);
        const {name,emailId,password,role}=req.body;
        // user already present or not 
        const existingUser=await User.findOne({emailId:emailId})
        if(existingUser){
            throw new Error("User already Exists !")
        }

        // encrypt our password 
        const hashPassword=await bcrpyt.hash(password,10);

        // new instance of user
        const user=new User({
            name,
            emailId,
            password:hashPassword,
            role,

        })
        const savedUser= await user.save();

        res.json({
            message:"Profile Created successfully !",
            data:savedUser,
        })

    }catch(err){
        res.status(400).send("ERROR: "+err.message )
    }



})

userAuthRouter.post("/login",async(req,res)=>{


        try{
            // validate
        const  {emailId,password}=req.body;
         if (!emailId || !password) {
                return res.status(400).send("Email and password are required.");
         }

        const user=await User.findOne({emailId})
        if(!user){
                res.status(401).send("Unauthorised user!")
        }
        const isValidPassword=await bcrpyt.compare(password,user?.password);

        if(isValidPassword){
            const token=await jwt.sign({_id:user._id,role:user.role},"Harsh@2181$",{expiresIn:"1d"});
            res.cookie("token",token,{
                httpOnly: true,
                expires:new Date(Date.now()+3*24*60*60*1000)

            });

            res.json({message:
                "Logged In successfully!"
            })

        }
        else{
            throw new Error("Incorrect Password !")
        }
            
        }catch(err){
            res.status(400).send("ERROR: "+err.message )
        }
      




})

userAuthRouter.post("/student",auth,isStudent,(req,res)=>{

    res.send("Welcome to student restricted field !")
})
userAuthRouter.post("/admin",auth,isAdmin,(req,res)=>{

    res.send("Welcome to admin restricted field !")
})


module.exports=userAuthRouter;