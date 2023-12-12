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

routeUser.get("/verifyOTP", auth.isLogout, userController.verifyOTP);

routeUser.post("/verifyOTP",  userController.verifyPost);

routeUser.get("/login", auth.isLogout, userController.loadLogin);

routeUser.post("/login", auth.isLogout, userController.loginPost);

routeUser.get("/logout", userController.userLogout);

routeUser.get('/detailshop',async(req,res)=>{
  try {
      const id=req.query.id;
      const data=await Product.findOne({_id:id})
      console.log(data);
      res.render('detailshop',{data:data})
  } catch (error) {
      console.log(error.message);
  }

})

routeUser.patch('/getcart',async(req,res)=>{
  try {
    console.log(req.session);
    console.log(req.session.user_id !== undefined);
    if(req.session.user_id !==undefined){
    const product_id=req.body.id
    const userid=req.session.user_id
    const productData = await Product.findById(product_id)
    const cartProduct = await cartModel.findOne({ user: userid ,'product.productId':product_id})
    let productPrice= productData.price
    console.log("productssssss"+productPrice);

    if(productData.quantity>0){
      if(cartProduct){
        res.json({failed:false})
      }else{
        const data={
          productId:product_id,
          price:productPrice,
          totalPrice:productPrice,
        }
        console.log(data);
      
      await cartModel.findOneAndUpdate({user:userid},{$set:{user:userid},$push:{product:data}},{upsert:true,new:true})
      res.json({failed:false})
      }
    }else{
      res.json({failed:true})
    }
    }
    else{
      res.json({success:"signup"})
    }

  } catch (error) {
    console.log(error.message);
  }
})

routeUser.get('/showcart',async(req,res)=>{
  try {
    if (req.session.user_id) { 
    const id=req.session.user_id;
    const cartData=await cartModel.findOne({user:id}).populate('product.productId')
    console.log(cartData)
    const subtotal = cartData.product.reduce((acc,val)=> acc+val.totalPrice,0)

    if(cartData){
      res.render('cart',{data:cartData,subtotal})
    }else{
      res.render('cart')
    }
  }else{
    res.redirect('/login')
  }

  } catch (error) {
    console.log(error.message);
  }
})


routeUser.post('/updatecart',async (req, res) => {
  const product_id = req.body.productId
  const user_id = req.session.user_id
  const count = req.body.count
  console.log(product_id,user_id,count);
  const cartD = await cartModel.findOne({ user: user_id })
  console.log(cartD);
  const updatedCart = await cartModel.findOneAndUpdate(
    { user: user_id, 'product.productId': product_id },
    {
      $inc: {
        'product.$.quantity': count,
        'product.$.totalPrice': count * cartD.product.find(p => p.productId.equals(product_id)).price,
      },
    },
    { new: true }
  );
  res.json({success:true})
});


module.exports = routeUser;
