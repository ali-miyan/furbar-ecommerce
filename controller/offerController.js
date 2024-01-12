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
const offerModel = require('../models/offerModel')

const offer = async (req,res)=>{
    try {
        const offerData = await offerModel.find()   
        res.render('offer',{offerData})
    } catch (error) {
        console.log(error.message);
    }
}
const addOffer = async (req,res)=>{
    try {
        res.render('addoffer')
    } catch (error) {
        console.log(error.message);
    }
}

const addOfferPost = async (req,res)=>{
    try {
        console.log('hwlooooooooooooo');
        const data = new offerModel({
            name:req.body.name,
            discountAmount:req.body.discount,
            activationDate:req.body.activationDate,
            expiryDate:req.body.expiryDate,
        })

       const saved =  await data.save()
        res.redirect('/admin/offer')

    } catch (error) {       
        console.log(error.message);
    }
}

const deleteOffer = async (req,res) =>{
    try {
        const user = req.body.id; 
        console.log(user);
        const userValue = await offerModel.deleteOne({ _id: user });
        console.log(user);
        res.json({ success: true });
      } catch (error) {
        console.log(error.message);
      }
}

const applyOffer = async(req,res)=>{
    try {
        const {id,productId} = req.body; 
        console.log(productId,'idddd');
        const product = await Product.findOneAndUpdate(
            { _id:productId },
            { $set: { offer: id } },
            { new: true }
        );    
        res.json({success:true})
    } catch (error) {
        console.log(error);
    }
}


const removeOffer = async(req,res)=>{
    try {
        console.log('heloooo');
        const id = req.body.id
        console.log(id);
        const product = await Product.findOneAndUpdate(
            { _id:id },
            { $unset: { offer:1,discountedPrice:1} },
            { new: true }
        );    

        console.log(product);
        res.json({success:true})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    addOffer,
    offer,
    addOfferPost,
    deleteOffer,
    applyOffer,
    removeOffer
}
