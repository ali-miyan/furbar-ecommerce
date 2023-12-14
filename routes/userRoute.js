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

routeUser.get("/verifyOTP", auth.isLogout, userController.verifyOTP);

routeUser.post("/verifyOTP",auth.isLogout,userController.verifyPost);

routeUser.get("/login", auth.isLogout, userController.loadLogin);

routeUser.post("/login", auth.isLogout, userController.loginPost);

routeUser.get("/logout",auth.isLogin,userController.userLogout);

routeUser.get('/detailshop',userController.detailShop)

routeUser.patch('/getcart',auth.isLogin,cartController.getCart)

routeUser.get('/showcart',auth.isLogin,cartController.showCart)

routeUser.post('/updatecart',auth.isLogin,cartController.updateCart);

routeUser.post('/removecart',auth.isLogin,cartController.removeCart);

routeUser.get('/checkout',auth.isLogin,cartController.checkout)

routeUser.post('/checkout',auth.isLogin,cartController.checkoutPost)

module.exports = routeUser;
