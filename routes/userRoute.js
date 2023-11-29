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
routeUser.get('/home',userController.loadHome,auth.isLogin)

routeUser.get('/signup',(req,res)=>{
    res.render('signup')
})


routeUser.post('/signup',userController.signupPost)

routeUser.get('/verifyOTP',userController.verifyOTP)

routeUser.post('/verifyOTP',userController.verifyPost)

routeUser.get('/login',(req,res)=>{
    res.render('login')
})



module.exports=routeUser
