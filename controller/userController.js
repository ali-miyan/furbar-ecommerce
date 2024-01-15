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
const path = require('path')
const ejs = require('ejs')
config.connectDB();
const Product=require("../models/productModel");
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModal');
const categoryModel = require('../models/categoryModel');
const puppeteer = require('puppeteer');
const { generateKey } = require('crypto');


//route to home page
const loadHome=async(req,res)=>{
    try {
        const user_id=req.session.user_id
        const user = await User.findById(user_id)
        res.render('home',{user})

    } catch (error) {
        console.log(error);
    }
}

//shop page
const loadShop = async (req, res) => {
    try {
      const category = await categoryModel.find({ _id: { $in: await Product.distinct("categoryId")}});
      let product;
      if (req.query.filteredProducts) {
        product = JSON.parse(req.query.filteredProducts);
      } else {
        product = await Product.find({}).populate('offer');
      }
      const selectedCategories = req.query.categories ? JSON.parse(req.query.categories) : [];
      res.render('shop', { product, category, selectedCategories });
    } catch (error) {
      console.log(error);
    }
  }

  const categoryFilter = async (req, res) => {
    try {
    const filtered = req.body.category;
    console.log(filtered,'ddddddddd');
    const products = await Product.find({ categoryId: { $in: filtered } }).populate('categoryId');
      res.json({ products });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
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
const loadProfile = async (req, res) => {
    try {
            console.log("profile session" + req.session.user_id);
            const user = await User.findOne({ _id: req.session.user_id });
            const address = await addressModel.findOne({ user: req.session.user_id });
            const order = await orderModel.find({ user: req.session.user_id })
            .populate('products.productId')
        
            res.render('profile', { user, address, order });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


//login page
const loadLogin=async(req,res)=>{
    try {
        const loginmessage=req.query.loginmessage
        res.render('login',{loginmessage})
    } catch (error) {
        console.log(error);
    }
}

//signup and storing data to database
const signupPost = async (req, res) => {
    try {
        let { name, email,mobile,password,code } = req.body;
        console.log(code,'code');
        let data;
        const referalCheck = await User.find({referalCode:code})
        console.log('helooooooooooooooo');
        if(referalCheck.length === 0){
            console.log('helooooooooo');
            res.render('signup', { message: 'Invalid referal code'});
        }else{
             data ={
                amount:1000,
                date:new Date()
              }
        }
            const userExists = await User.findOne({ email });
            if (userExists) {
                res.render('signup', { message: 'User with provided email already exists' });
                console.log(userExists);
            } else {
                const hashedPassword = await securePassword(password);
                const newUser = new User({
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: hashedPassword,
                    verified: false,
                    isAdmin:0,
                    referalCode:await generateCode()
                });
                const result = await newUser.save();
                console.log(data,'dataaaaaaaaa');
                if (data && result) {
                    await User.findByIdAndUpdate(result._id, { $push: { walletHistory: data } }, { new: true });
                }
                console.log(result);
                sendOTPverification(result, res);
            }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


//rendering otp page
const verifyOTP=async (req, res) => {
    try {
        const id = req.query.id
        res.render('otp',{id});
    } catch (error) {
        console.log("Error setting session:", error.message);
    }
};

//verifying otp
const verifyPost=async(req,res)=>{
    try {
      const otp= req.body.otp
      const userId=req.body.id
      console.log("Session ID:", userId);
        
            const userOTPVerificationrecord=await userVerification.find({user_id:userId})
            console.log(userOTPVerificationrecord);            

            if (userOTPVerificationrecord.length==0) {
                res.render('otp',{message:"record doesn't exist or has been verified already"})
            }else{
                const {expiresAt}=userOTPVerificationrecord[0];
                const hashedOTP=userOTPVerificationrecord[0].otp;

                if(expiresAt<Date.now()){
                    await userOTPVerificationrecord.deleteOne({userId});
                    res.render('otp',{message:"your otp has been expired"})                    
                }else{
                    const validOTP=await bcrypt.compare(otp,hashedOTP);
                    if(!validOTP){
                        res.render('otp',{message:"Invalid code"})

                    }else{
                       await User.updateOne({_id:userId},{verfied:true});
                       await userVerification.deleteOne({userId});
                       req.session.user_id=userId
                    res.redirect(`/`)
                    }
                }
            }
        
    } catch (error) {
        console.log(error.message);
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
        user_id:_id,
        otp:hashedOTP,
        createAt:Date.now(),
        expiresAt:Date.now()+36000,
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
    
        const validUser=await User.findOne({email:email})
        console.log(validUser);
        if(validUser){
            const passwordMatch=await bcrypt.compare(password,validUser.password)
            if(passwordMatch){
                req.session.user_id=validUser._id;
                res.redirect('/')
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

                res.redirect('/');
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const detailShop=async(req,res)=>{
    try {
        const id=req.query.id;
        const data=await Product.findOne({_id:id}).populate('categoryId').populate('offer')
        console.log(data);
        res.render('detailshop',{data})
    } catch (error) {
        console.log(error.message);
    }
  
  }

  const addressform=async (req, res) => {
    try {
      const userId=req.session.user_id;
      const data = {
        name: req.body.name,
        address: req.body.address,
        landmark: req.body.landmark,
        state: req.body.state,
        city: req.body.city,
        pincode: req.body.pincode,
        phone: req.body.phone,
        email: req.body.email
    };
    console.log(data);
  
        const findAddress = await addressModel.findOneAndUpdate(
        { user: userId },
        { $push: { address: data } },
        { upsert: true, new: true }
      )
        res.json({ add: true});
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ add: false, error: "Internal Server Error" });
    }
  }

  const editAddress= async (req, res) => {
    const { editAddressId, editName, editAddress, editLandmark, editState, editCity, editPincode, editPhone, editEmail } = req.body;
  
    try {
      console.log(editAddressId);
      const user = await addressModel.findOne({ 'address._id': editAddressId })
      console.log(user);
  
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        const addressToUpdate = user.address.id(editAddressId);
  
        if (!addressToUpdate) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
  
        addressToUpdate.name = editName;
        addressToUpdate.address = editAddress;
        addressToUpdate.landmark = editLandmark;
        addressToUpdate.state = editState;
        addressToUpdate.city = editCity;
        addressToUpdate.pincode = editPincode;
        addressToUpdate.phone = editPhone;
        addressToUpdate.email = editEmail;
  
        await user.save();
  
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  const deleteAddress=async(req,res)=>{
    try {
      const user_id=req.session.user_id
      const addressId = req.body.addressId
  
      await addressModel.updateOne({user:user_id},{$pull:{address:{_id:addressId}}})
  
     res.json({success:true})
  
   } catch (error) {
       console.log(error.message);
       res.render('500Error')
   }
  }





  const editUser=async(req,res)=>{
    try {
      const userData = await User.findById(req.session.user_id)
  
         await User.findOneAndUpdate(
              { email: userData.email,  },
              {
                  $set: {
                      name:req.body.editname,
                      mobile:req.body.editmobile,
                  },
              },
              { new: true }
          );
          res.redirect('/profile')
    } catch (error) {
      console.log(error.message);
    }
  }

  

  const generatePdf = async(req,res)=>{
    try {
        console.log('heloooooooooo');
        const orderId = req.query.id
        console.log(orderId);
        const orderData = await orderModel.findById({_id:orderId}).populate('products.productId')
        console.log(orderData,'orderdataaaaaaaaaaaaa');
        console.log(__dirname)
        const ejsPagePath = path.join(__dirname, '../views/user/pdf.ejs');
        const ejsPage = await ejs.renderFile(ejsPagePath,{orderData});
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(ejsPage);
        const pdfBuffer = await page.pdf();
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.log(error.message);
    }
  }
  
  function generateCode(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
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
    loadLogin,
    loadShop,
    detailShop,
    addressform,
    editAddress,
    deleteAddress,
    editUser,
    categoryFilter,
    generatePdf
}