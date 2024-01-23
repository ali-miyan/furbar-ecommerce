const express = require("express");
const routeAdmin = express();
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
const orderModel=require('../models/orderModal')
const couponModel=require('../models/couponModel')
const couponController = require('../controller/couponController')
const offerController = require('../controller/offerController')

routeAdmin.set("view engine", "ejs");
routeAdmin.set("views", "./views/admin");

routeAdmin.get("/",auth.isAdminLogout,adminController.adminLogin);

routeAdmin.patch('/blockusers/:id',adminController.blockUser)

routeAdmin.get("/users",auth.isAdminLogin,adminController.loadUser);

routeAdmin.get("/dashboard",auth.isAdminLogin,adminController.loadDashboard);

routeAdmin.post("/",auth.isAdminLogout,adminController.loadSignin);

routeAdmin.get('/category',auth.isAdminLogin,adminController.loadCategory);

routeAdmin.get('/addcategory',auth.isAdminLogin,adminController.addCategory)

routeAdmin.post('/addcategory',auth.isAdminLogin,adminController.addCategoryPost)

routeAdmin.get('/editcategory',auth.isAdminLogin,adminController.editCategory)

routeAdmin.post('/editcategory',auth.isAdminLogin,adminController.editCategoryPost)

routeAdmin.patch('/blockcategory/:id',adminController.blockCategory)

routeAdmin.get('/products',auth.isAdminLogin,productController.getProduct)

routeAdmin.get('/addproducts',auth.isAdminLogin,productController.addProducts)

routeAdmin.post('/addproducts',multer.uploadproduct,productController.addProductsPost)

routeAdmin.get('/editproducts',auth.isAdminLogin,productController.editProducts)

routeAdmin.post('/editproducts',auth.isAdminLogin,multer.uploadproduct,productController.editProductsPost)

routeAdmin.patch('/blockproducts/:id',auth.isAdminLogin,productController.blockProducts)

routeAdmin.get('/orders',auth.isAdminLogin,adminController.showOrders)

routeAdmin.get('/coupon', auth.isAdminLogin,couponController.coupon)

routeAdmin.get('/addcoupon',auth.isAdminLogin,couponController.addCoupon)

routeAdmin.post('/addcoupon',auth.isAdminLogin,couponController.addCouponPost)

routeAdmin.get('/offer', auth.isAdminLogin,offerController.offer)

routeAdmin.get('/addoffer',auth.isAdminLogin,offerController.addOffer)

routeAdmin.post('/addoffer',auth.isAdminLogin,offerController.addOfferPost)

routeAdmin.patch('/deleteoffer',auth.isAdminLogin,offerController.deleteOffer)

routeAdmin.patch('/deletecoupon',auth.isAdminLogin,couponController.deleteCoupon)

 routeAdmin.post('/updatestatus',auth.isAdminLogin,adminController.updateStatus)

 routeAdmin.get('/showorder',auth.isAdminLogin, adminController.detailOrder)

 routeAdmin.patch('/applyoffer',auth.isAdminLogin,offerController.applyOffer)

 routeAdmin.patch('/removeoffer',auth.isAdminLogin,offerController.removeOffer)

 routeAdmin.patch('/applycategoryoffer',auth.isAdminLogin,offerController.applyCategoryOffer)

 routeAdmin.patch('/removecategoryoffer',offerController.removeCategoryOffer)

 routeAdmin.get('/reportpage',auth.isAdminLogin, adminController.reportPage)

 routeAdmin.get('/downloadreport',adminController.salesReport)

 routeAdmin.get('/downloadreportexel',adminController.salesReportExel)


module.exports = routeAdmin;
