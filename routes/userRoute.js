const express = require('express');
const routeUser=express()
const mongoose = require('mongoose');
const connectDB = require('../config/config');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

connectDB();

const userVerification=require('../models/userOTP');
const User = require('../models/userModel');
const userOTP = require('../models/userOTP');

routeUser.set('view engine','ejs');
routeUser.set('views','./views/user');

routeUser.get('/',(req,res)=>{
    res.render('home')
})

routeUser.get('/signup',(req,res)=>{
    res.render('signup')
})

routeUser.get('/verifyOTP',(req,res)=>{
    res.render('otp')
})

//node mailer
let transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    auth:{
        user:process.env.user_email,
        pass:process.env.user_password
    }
})

const saltRound=10;

//otp signup
routeUser.post('/signup',(req,res)=>{
    let {name,email,password}=req.body
if (name==""||email==""||password=="") {
    res.render('signup',{message:'Empty input fields'})
 
}else if(!/^[a-zA-Z]+$/.test(name)){

    res.render('signup',{message:'invalid name entered'})

}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){

    res.render('signup',{message:'invalid email entered'})
}else if(password.length<8){

    res.render('signup',{message:'password is too short'})
}else{
    User.find({email})
    .then((result) => {
        if(result.length){
            res.render('signup',{message:'user with provided email already exixts'})
        }else{
            bcrypt.hash(password,saltRound)
            .then((hashedpassword)=>{
                const newUser=new User({
                    name,
                    email,
                    password:hashedpassword,
                    verfied:false,
                });
                newUser.save().then((result)=>{
                   sendOTPverification(result,res) 
                })
            })
        }
    })
}
})

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
    const hashedOTP=await bcrypt.hash(otp,saltRound);
    
    const newOTP = await new userOTP({
        userId:_id,
        otp:hashedOTP,
        createAt:Date.now(),
        expiresAt:Date.now()+5600000,
    })

    //save otp records
    await newOTP.save();
    await transporter.sendMail(mailOption);
    res.redirect(`/verifyOTP?id=${_id,hashedOTP}`)


    // res.json({
    //     status:"PENDING",
    //     message:"Verification otp email sent",
    //     data:{
    //         userId:_id,
    //         email,
    //     }
    // })

    } catch (error) {
        throw new Error;
    }
}

routeUser.post('/verifyOTP',async(req,res)=>{
    try {
        let {userId,otp}=req.body;
        if(!userId||!otp){
             res.render('otp',{message:"field cannot be empty"})
        }else{
            const userOTPVerificationrecord=await userVerification.find({
               userId,
            })
            if (userOTPVerificationrecord.length<=0) {
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
                    res.redirect(`/`)
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status:"FAILED",
            message:error.message
        })
    }
})

routeUser.get('/login',(req,res)=>{
    res.render('login')
})



module.exports=routeUser
