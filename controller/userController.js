const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');
const auth = require('../middleware/auth');
const userController=require('../controller/userController')
const userVerification=require('../models/userOTP');
const User = require('../models/userModel');
const userOTP = require('../models/userOTP');
const dotenv = require('dotenv')
dotenv.config()
config.connectDB();

//route to home page
const loadHome=async(req,res)=>{
    try {
        res.render('home')

    } catch (error) {
        console.log(error);
    }
}
//signup page
const loadSignup=async(req,res)=>{
    try {
        res.render('signup')
    } catch (error) {
        console.log(error);
    }
}
//profile page
const loadProfile=async(req,res)=>{
    try {
        if(req.session.user_id){
            console.log("profile session"+req.session.user_id);
            res.render('profile')
        }else{
        res.render('signup')
        }
    } catch (error) {
        console.log(error);
    }
    
}

//login page
const loadLogin=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error);
    }
}

//signup and storing data to database
const signupPost = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (name === "" || email === "" || password === "") {
            res.render('signup', { message: 'Empty input fields' });
        } else if (!/^[a-zA-Z]+$/.test(name)) {
            res.render('signup', { message: 'Invalid name entered' });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.render('signup', { message: 'Invalid email entered' });
        } else if (password.length < 8) {
            res.render('signup', { message: 'Password is too short' });
        } else {
            const userExists = await User.findOne({ email });

            if (userExists) {
                res.render('signup', { message: 'User with provided email already exists' });
                console.log(userExists);
            } else {
                const hashedPassword = await securePassword(password);
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    verified: false,
                });

                const result = await newUser.save();
                console.log(result);
                sendOTPverification(result, res);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


//rendering otp page
const verifyOTP=async (req, res) => {
    try {
        req.session.userId = req.query.id; 
        console.log("Session ID set:", req.session.userId);   
        console.log("Session ID set:", req.query.id);   

        res.render('otp');
    } catch (error) {
        console.log("Error setting session:", error.message);
    }
};

//verifying otp
const verifyPost=async(req,res)=>{
    try {
      const otp= req.body.otp
      const userId=req.session.userId
      console.log("Session ID:", userId);
        
            const userOTPVerificationrecord=await userVerification.find({
               userId
            })
            console.log(userOTPVerificationrecord);            

            if (userOTPVerificationrecord.length===0) {
                res.render('otp',{message:"record doesn't exist or has been verified already"})
                // throw Error("record doesn't exist or has been verified already")       
            }else{
                const {expiresAt}=userOTPVerificationrecord[0];
                const hashedOTP=userOTPVerificationrecord[0].otp;

                if(expiresAt<Date.now()){
                    await userOTPVerificationrecord.deleteMany({userId});
                    res.render('otp',{message:"your otp has been expired"})                    
                    // throw new Error("your otp has been expired")
                }else{
                    const validOTP=await bcrypt.compare(otp,hashedOTP);
                    if(!validOTP){
                        // throw new ("Invalid code")
                        res.render('otp',{message:"Invalid code"})
                    }else{
                       await User.updateOne({_id:userId},{verfied:true});
                       await userVerification.deleteMany({userId});
                    //    res.json({
                    //     status:"VERIFIED",
                    //     message:"user email verified successfully"
                    //    })
                    res.redirect(`/login`)
                    }
                }
            }
        
    } catch (error) {
        res.json({
            status:"FAILED",
            message:error.message
        })
    }
}


//hashing password
const securePassword=async(password)=>{
    try {
        const hashedPassword=bcrypt.hash(password,10)
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}

//sending otp
const sendOTPverification=async({_id,email},res)=>{
    try {
        const otp=`${Math.floor(1000+Math.random()*900)}`
        const mailOption={
            from:process.env.user_email,
            to:email,
            subject:"Verify Your Email",
            html:`<p>Enter ${otp} to verify your email Address
            this code will expires in 1 hour`
        }

        //hashing the otp
    const hashedOTP=await bcrypt.hash(otp,10);
    
    const newOTP = await new userOTP({
        userId:_id,
        otp:hashedOTP,
        createAt:Date.now(),
        expiresAt:Date.now()+3600000,
    })

    //save otp records
    await newOTP.save();
    await transporter.sendMail(mailOption);
    res.redirect(`/verifyOTP?id=${_id}`);
    
    } catch (error) {
        throw new Error;
    }
}

//node mailer
let transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    auth:{
        user:process.env.user_email,
        pass:process.env.user_password
    }
})


//login the user
let loginPost=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        console.log(password);
        console.log(email);
    
        const validUser=await User.findOne({email:email})
        console.log(validUser);
        if(validUser){
            const passwordMatch=await bcrypt.compare(password,validUser.password)
            if(passwordMatch){
                req.session.user_id=validUser._id;
                res.redirect('/home')
            }else{
                res.render('login',{message:'incorrect password'})

            }
        }else{
            res.render('login',{message:'ivalid email or password'})

        }
    } catch (error) {
        console.log(error);
    }

}

//user logout
const userLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err.message);
            } else {
                console.log("Session destroyed");
                // Redirect to the home page or another appropriate route
                res.redirect('/home');
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    verifyOTP,
    verifyPost,
    loadHome,
    signupPost,
    loginPost,
    userLogout,
    loadSignup,
    loadProfile,
    loadLogin
}