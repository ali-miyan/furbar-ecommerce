const express = require("express");
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
const auth = require("../middleware/auth");
const Product=require("../models/productModel")
const sharp = require('sharp');
const multer=require('../middleware/multer')
const productController=require("../controller/productController")
const session = require("express-session");
const userController = require("../controller/userController");
const cartModel=require('../models/cartModel')
const addressModel=require('../models/addressModel')
const cartController=require('../controller/cartController')

const routeUser = express();

routeUser.use(
  session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false,
  })
);



routeUser.use(express.urlencoded({ extended: true }));
routeUser.use(express.json());

routeUser.set("view engine", "ejs");
routeUser.set("views", "./views/user");

routeUser.get("/", userController.loadHome);

// routeUser.get('/home',userController.loadHome,auth.isLogout)

routeUser.get("/shop", userController.loadShop);

routeUser.get("/profile", userController.loadProfile);

routeUser.get("/signup", auth.isLogout, userController.loadSignup);

routeUser.post("/signup", auth.isLogout, userController.signupPost);

routeUser.get("/verifyOTP", userController.verifyOTP);

routeUser.post("/verifyOTP",userController.verifyPost);

routeUser.get("/login", auth.isLogout, userController.loadLogin);

routeUser.post("/login", auth.isLogout, userController.loginPost);

routeUser.get("/logout",auth.isLogin,userController.userLogout);

routeUser.get('/detailshop',userController.detailShop)

routeUser.post('/getcart',auth.isLogin,cartController.getCart)

routeUser.get('/showcart',auth.isLogin,cartController.showCart)

routeUser.post('/updatecart',auth.isLogin,cartController.updateCart);

routeUser.post('/removecart',auth.isLogin,cartController.removeCart);

routeUser.get('/checkout',auth.isLogin,cartController.checkout)

routeUser.post('/checkout',auth.isLogin,cartController.checkoutPost)

routeUser.post('/addressform',async (req, res) => {
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
});


routeUser.post('/checkoutform',async(req,res)=>{
  try {
    const userId=req.session.user_id
    const {name,address,landmark,state,city,pincode,phone,email}=req.body
    const newAddress = {name,address,landmark,state,city,pincode,phone,email,};

      const data = await addressModel.findOneAndUpdate(
      { user: userId },
      { $push: { address: newAddress } },
      { upsert: true, new: true }
    )
    res.redirect('/successpage')

  } catch (error) {
    console.log(error);
  }

})


routeUser.post('/editaddress',async(req,res)=>{
  try {
    const userId=req.session.user_id
    const {name,address,landmark,state,city,pincode,phone,email}=req.body
    const updatedAddress = {
      name,
      address,
      landmark,
      state,
      city,
      pincode,
      phone,
      email,
    };

    const data = await addressModel.findOneAndUpdate(
      { user: userId }, 
      { $set: { 'address.$': updatedAddress } },
      { new: true }
    );

      res.redirect('/profile')
  } catch (error) {
    console.log(error);
  }

})

routeUser.post('/deleteaddress',async(req,res)=>{
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
})

module.exports = routeUser;
