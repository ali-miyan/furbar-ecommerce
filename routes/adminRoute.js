const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
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

module.exports = routeAdmin;
