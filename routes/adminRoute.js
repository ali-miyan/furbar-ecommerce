const express = require('express');
const routeAdmin=express()
const config = require('../config/config');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const adminController=require('../controller/adminConroller')

routeAdmin.set('view engine','ejs');
routeAdmin.set('views','./views/admin');

routeAdmin.get('/',(req,res)=>{
    res.render('adminlogin')
})

routeAdmin.get('/dashboard',adminController.loadDashboard)

routeAdmin.post('/signin',adminController.loadSignin)


module.exports=routeAdmin