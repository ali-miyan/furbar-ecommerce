const express = require("express");
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
const auth = require("../middleware/auth");
const Product = require("../models/productModel")
const sharp = require('sharp');
const multer = require('../middleware/multer')
const productController = require("../controller/productController")
const session = require("express-session");
const userController = require("../controller/userController");
const cartModel = require('../models/cartModel')
const addressModel = require('../models/addressModel')
const cartController = require('../controller/cartController')
const orderModel = require('../models/orderModal')
const orderController = require('../controller/orderController')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const CouponModel = require("../models/couponModel");
const couponController = require('../controller/couponController')


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
routeUser.set("views", "./views/user");


routeUser.get("/", userController.loadHome);

routeUser.get("/contact",userController.loadContact)

routeUser.get("/about",userController.loadAbout)

routeUser.get("/blog",userController.loadBlog)

routeUser.get("/shop", userController.loadShop);

routeUser.get("/profile",auth.isLogin, userController.loadProfile);

routeUser.get("/signup", auth.isLogout, userController.loadSignup);

routeUser.post("/signup", auth.isLogout, userController.signupPost);

routeUser.get("/verifyOTP",auth.isLogout, userController.verifyOTP);

routeUser.post("/otp",auth.isLogout,userController.verifyPost);

routeUser.get("/login", auth.isLogout, userController.loadLogin);

routeUser.post("/login", auth.isLogout, userController.loginPost);

routeUser.get("/logout", auth.isLogin, userController.userLogout);

routeUser.get('/detailshop', userController.detailShop)

routeUser.post('/getwishlist', cartController.getWishlist)

routeUser.get('/wishlist', auth.isLogin, cartController.wishlist)

routeUser.post('/removewishlist', cartController.removeWishlist)

routeUser.post('/getcart', cartController.getCart)

routeUser.get('/showcart', auth.isLogin, cartController.showCart)

routeUser.post('/updatecart', auth.isLogin, cartController.updateCart);

routeUser.post('/removecart', auth.isLogin, cartController.removeCart);

routeUser.get('/checkout', auth.isLogin, orderController.checkout)

routeUser.post('/checkoutform', auth.isLogin, orderController.checkoutPost)

routeUser.post('/addressform', auth.isLogin, userController.addressform);

routeUser.post('/editaddress', auth.isLogin, userController.editAddress);

routeUser.post('/deleteaddress', auth.isLogin, userController.deleteAddress)

routeUser.get('/detailorder', auth.isLogin, orderController.detailOrder)

routeUser.post('/cancelorder', auth.isLogin, orderController.cancelOrder)

routeUser.post('/returnorder', auth.isLogin, orderController.returnOrder)

routeUser.post('/edituser', auth.isLogin, userController.editUser)

routeUser.get('/successpage', auth.isLogin,orderController.successPage)

routeUser.get('/generatepdf',userController.generatePdf)

routeUser.post('/shippingamount', auth.isLogin, cartController.shippingAmount)

routeUser.post('/verifypayment', auth.isLogin, orderController.verifypayment)

routeUser.post('/applycoupon', auth.isLogin, couponController.applyCoupon);

routeUser.post('/removecoupon', auth.isLogin,couponController.removeCoupon);

routeUser.post('/resendotp',userController.resendOtp)

routeUser.get('/forgetpassword',auth.isLogout,userController.forgetPassword)

routeUser.post('/forgetpassword',auth.isLogout,userController.forgetPasswordPost)

routeUser.get('/resetpassword',auth.isLogout,userController.resetPassword)

routeUser.post('/resetpassword',auth.isLogout,userController.resetPasswordPost)

routeUser.post('/changepassword',auth.isLogin,userController.changePassword)

module.exports = routeUser;
