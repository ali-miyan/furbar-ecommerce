const express = require("express");
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("./adminConroller");
const auth = require("../middleware/auth");
const Product=require("../models/productModel")
const sharp = require('sharp');
const multer=require('../middleware/multer')
const productController=require("./productController")
const session = require("express-session");
const userController = require("./userController");
const cartModel=require('../models/cartModel')
const addressModel=require('../models/addressModel')
const cartController=require('./cartController')
const orderModel=require('../models/orderModal')
const couponModel = require('../models/couponModel')




const applyCoupon = async (req, res) => {
    try {
      const couponId = req.body.id;
      const user_id = req.session.user_id;
      const currentDate = new Date();
      const couponData = await couponModel.findOne({_id: couponId,expiryDate: { $gte: currentDate },is_blocked: false});  
          const exists = couponData.usedUsers.includes(user_id);
  
          if (!exists) {
            const existingCart = await cartModel.findOne({ user: user_id });
            if (existingCart && existingCart.couponDiscount == null) {
              await couponModel.findOneAndUpdate({ _id: couponId }, { $push: { usedUsers: user_id } });
              await cartModel.findOneAndUpdate({ user: user_id }, { $set: { couponDiscount: couponData._id } });
              res.json({ coupon: true });
            } else {
              res.json({ coupon: 'alreadyApplied' });
            }
          } else {
            res.json({ coupon: 'alreadyUsed' });
          }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  const removeCoupon = async (req, res) => {
    try {
      const couponId = req.body.id;
      const user_id = req.session.user_id
      const cartData = await cartModel.findOne({ user: user_id })
      const couponData = await couponModel.findOneAndUpdate({ _id: couponId }, { $pull: { usedUsers: user_id } })
      const updateCart = await cartModel.findOneAndUpdate({ user: user_id }, { $set: { couponDiscount: null } })
      res.json({success:true})  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const coupon = async(req,res)=>{
    try {
      const coupon = await couponModel.find({})
      res.render('coupon',{coupon})
      
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async(req,res)=>{
  try {
      res.render("addcoupon")
  } catch (error) {
      console.log(error.message);
  }
}

const addCouponPost = async (req,res)=>{
  try {

      const couponData = await couponModel.findOne({couponCode:req.body.couponcode})

      if(couponData){
          res.render("addcoupon",{message:'coupon code already exist'})
      }else{
          const data = new couponModel({
              name:req.body.couponame,
              couponCode:req.body.couponcode,
              discountAmount:req.body.discount,
              activationDate:req.body.activationdate,
              expiryDate:req.body.expirydate,
              criteriaAmount:req.body.criteriamount,
          })

          await data.save()
          res.redirect('/admin/coupon')
      }
     
  } catch (error) {
      console.log(error.message);
  }
}


const deleteCoupon = async(req,res)=>{
  try {
    const user = req.body.id; 
    console.log(user);
    const userValue = await couponModel.deleteOne({ _id: user });
    console.log(user);
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
}

  module.exports={
    applyCoupon,  
    removeCoupon,
    coupon,
    addCoupon,
    addCouponPost,
    deleteCoupon
}
