const express = require('express');
const config = require('../config/config');
const session = require('express-session');
const auth = require('../middleware/auth');
const userController=require('../controller/userController')

const routeUser=express()

routeUser.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false
  }))

routeUser.use(express.urlencoded({ extended: true }));
routeUser.use(express.json());

routeUser.set('view engine','ejs');
routeUser.set('views','./views/user');

routeUser.get('/',userController.loadHome,auth.isLogout)

routeUser.get('/home',userController.loadHome,auth.isLogout)

routeUser.get('/profile',userController.loadProfile)

routeUser.get('/signup',userController.loadSignup)

routeUser.post('/signup',userController.signupPost)

routeUser.get('/verifyOTP',userController.verifyOTP)

routeUser.post('/verifyOTP',userController.verifyPost)

routeUser.get('/login',userController.loadLogin)

routeUser.post('/login',userController.loginPost)

routeUser.get('/logout',userController.userLogout)

module.exports=routeUser
