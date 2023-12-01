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

routeAdmin.get('/blockuser',async(req,res)=>{
    try{
    const user=req.query.id
    const userValue=await User.findOne({_id:user})
        if(userValue.is_blocked){
            await User.updateOne({_id:user},{$set:{is_blocked:false}})
            req.session.user_id = null;
        }
        else {
            await User.updateOne({_id:user},{$set:{is_blocked:true}})
        }
        res.redirect('/admin/users')
}catch(error){
    console.log(error.message);
}
})

routeAdmin.get('/users',async(req,res)=>{
    try {
        const userData=await User.find({})
        res.render('users',{users:userData})
    } catch (error) {
        console.log(error);
    }
    
})

routeAdmin.get('/dashboard',adminController.loadDashboard)

routeAdmin.post('/signin',adminController.loadSignin)


module.exports=routeAdmin