const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
const Product=require("../models/productModel")
const sharp = require('sharp');
const multer=require('../middleware/multer')
const productController=require("../controller/productController")

// const auth=require('../middleware/auth')

routeAdmin.set("view engine", "ejs");
routeAdmin.set("views", "./views/admin");

routeAdmin.get("/", adminController.adminLogin);

routeAdmin.patch('/blockusers/:id',adminController.blockUser)

routeAdmin.get("/users", adminController.loadUser);

routeAdmin.get("/dashboard",adminController.loadDashboard);

routeAdmin.post("/signin", adminController.loadSignin);

routeAdmin.get('/category',adminController.loadCategory);

routeAdmin.get('/addcategory',adminController.addCategory)

routeAdmin.post('/addcategory',adminController.addCategoryPost)

routeAdmin.get('/editcategory',adminController.editCategory)

routeAdmin.post('/editcategory',adminController.editCategoryPost)

routeAdmin.patch('/blockcategory/:id',adminController.blockCategory)

routeAdmin.get('/products',productController.getProduct)

routeAdmin.get('/addproducts',productController.addProducts)

routeAdmin.post('/addproducts',multer.uploadproduct,productController.addProductsPost)

routeAdmin.get('/editproducts',productController.editProducts)

routeAdmin.post('/editproducts',multer.uploadproduct,productController.editProductsPost)

routeAdmin.patch('/blockproducts/:id',productController.blockProducts)

module.exports = routeAdmin;
