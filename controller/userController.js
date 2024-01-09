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
const Product=require("../models/productModel");
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModal');
const categoryModel = require('../models/categoryModel');


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
      const category = await categoryModel.find({ _id: { $in: await Product.distinct("categoryId") } });
      let product;
      if (req.query.filteredProducts) {
        product = JSON.parse(req.query.filteredProducts);
      } else {
        product = await Product.find({});
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
        let { name, email,mobile,password } = req.body;
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
                    isAdmin:0
                });
                const result = await newUser.save();
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
                    await userOTPVerificationrecord.deleteMany({userId});
                    res.render('otp',{message:"your otp has been expired"})                    
                }else{
                    const validOTP=await bcrypt.compare(otp,hashedOTP);
                    if(!validOTP){
                        res.render('otp',{message:"Invalid code"})

                    }else{
                       await User.updateOne({_id:userId},{verfied:true});
                       await userVerification.deleteMany({userId});
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
        const data=await Product.findOne({_id:id}).populate('categoryId')
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
      console.log('helooooooooooooooo');
      const user_id=req.session.user_id
      const addressId = req.body.addressId
  
      await addressModel.updateOne({user:user_id},{$pull:{address:{_id:addressId}}})
  
     res.json({success:true})
  
   } catch (error) {
       console.log(error.message);
       res.render('500Error')
   }
  }

  const detailOrder=async(req,res)=>{
    try {
      const user_id = req.session.user_id
      const order_id = req.query.id
      console.log(order_id);
      const orderData = await orderModel.findOne({_id:order_id}).populate('products.productId')
      await orderData.populate('products.productId.categoryId')
      res.render('orderdetails',{orderData,user_id})
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const cancelOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        console.log(userId);
        const orderId = req.body.orderId;
        const id = req.body.id
        const productId = req.body.productId;
        console.log(productId);
        const cancelReason = req.body.cancelReason;
        const productDetails = await Product.findById(productId).populate('categoryId');
 
        
    const orderData = await orderModel.findOneAndUpdate(
      { _id: orderId, 'products._id': id },
      {
        $push: {
          cancelledProduct: {
            quantity: 1,
            productStatus: 'cancelled',
            cancelReason: cancelReason,
            productDetails: productDetails,
          },
        },
        $pull: {
          products: { _id: id },
        },
      },
      { new: true }
    );

    if (orderData.products.length === 0) {
      await orderModel.findByIdAndUpdate(orderId, { orderStatus: 'returned or cancelled' });
    }
    if(orderData.payment !== 'Cash on delivery'){

        const walletAmount = orderData.cancelledProduct.reduce((acc, product) => {
        const productPrice = product.productDetails.price || 0;
              return acc + product.quantity * productPrice;
        },0); 
      
        const data = {
          amount:  walletAmount,
          date: Date.now(),
        }
        const newD = await User.findOneAndUpdate({ _id: userId }, { $inc: { wallet: walletAmount }, $push: { walletHistory: data } })

      }

        await Product.updateOne({ _id: productId }, { $inc: { quantity: 1 } });
        

        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.render('500Error');
    }
};
  const returnOrder = async (req, res) => {
    try {
        const userId=req.session.user_id
        const orderId = req.body.orderId;
        const productId = req.body.productId;
        const id = req.body.id
        const returnReason = req.body.returnReason;
        const productDetails = await Product.findById(productId).populate('categoryId');

            

        
        const orderData = await orderModel.findOneAndUpdate(
          { _id: orderId, 'products._id': id },
          {
            $push: {
              returnedProduct: {
                quantity: 1,
                productStatus: 'returned',
                returnReason: returnReason,
                productDetails: productDetails,
              },
            },
            $pull: {
              products: { _id: id },
            },
          },
          { new: true }
        );
        console.log("dtaaaaaa", orderData);

        if (orderData.products.length === 0) {
          // If it's empty, update the orderStatus
          await orderModel.findByIdAndUpdate(orderId, { orderStatus: 'returned or cancelled' });
        }


            await Product.updateOne({ _id: productId }, { $inc: { quantity: 1 } });


        const walletAmount = orderData.cancelledProduct.reduce((acc, product) => {
             const productPrice = product.productDetails.price || 0;
          
            return acc + product.quantity * productPrice;
          }, 0);
            const data = {
              amount:  walletAmount,
              date: Date.now(),
            }
            await User.findOneAndUpdate({ _id: userId }, { $inc: { wallet: walletAmount }, $push: { walletHistory: data } })

        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.render('500Error');
    }
};

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
    detailOrder,
    cancelOrder,
    editUser,
    returnOrder,
    categoryFilter
}