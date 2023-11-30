const express = require('express');
const routeAdmin=express()
const config = require('../config/config');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const adminController=require('../controller/adminConroller')

const loadDashboard=async(req,res)=>{
    try {
        res.render('adminhome')
    } catch (error) {
        console.log(error);
    }
}

const loadSignin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const validAdmin=await User.findOne({email:email})
        if(validAdmin && validAdmin.isAdmin==1){
            const passwordMatch=await bcrypt.compare(password,validAdmin.password)
            console.log(passwordMatch);
            if(passwordMatch){
            res.redirect('/admin/dashboard')
            }else{
                res.render('adminlogin',{message:'incorrect password'})

            }
        }else{
            res.render('adminlogin',{message:'you are not an admin'})
        }

    } catch (error) {
        console.log(error);
    }


}

module.exports={
    loadDashboard,
    loadSignin

}