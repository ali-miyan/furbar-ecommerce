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

const editOffer = async (req,res)=>{
    try {

        const id = req.query.id;
        const offerData = await offerModel.findById(id)
        res.render("editoffer",{offerData})
    } catch (error) {
        console.log(error.message);
    }
}
const editOfferPost = async (req,res)=>{
    try {
        const id = req.query.id
        const offerData = await offerModel.findById(id)

        await offerModel.findOneAndUpdate({_id:id},
            {
                name:req.body.name,
                discountAmount:req.body.discount,
                activationDate:req.body.activationDate,
                expiryDate:req.body.expiryDate,
            })

        res.redirect("/admin/offer")

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}

const blockOffer = async (req,res)=>{
    try {
        const id = req.params.id; 
        const userValue = await offerModel.findOne({ _id: id });
        if (userValue.is_blocked) {
          await offerModel.updateOne({ _id: id }, { $set: { is_blocked: false } });
        } else {
          await offerModel.updateOne({ _id: id }, { $set: { is_blocked: true } });
        }
        res.json({ block: true });
      } catch (error) {
        console.log(error.message);
      }
}


module.exports={
    editOffer,
    addOffer,
    offer,
    addOfferPost,
    blockOffer,
    editOfferPost
}
