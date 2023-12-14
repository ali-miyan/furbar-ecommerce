const express = require("express");
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const auth = require("../middleware/auth");
const Product=require("../models/productModel")
const sharp = require('sharp');
const multer=require('../middleware/multer')
const productController=require("../controller/productController")
const session = require("express-session");
const userController = require("../controller/userController");
const cartModel=require('../models/cartModel')
const addressModel=require('../models/addressModel')
const cartController=require('../controller/cartController')

const getCart=async(req,res)=>{
    try {
      if(req.session.user_id !==undefined){
      const product_id=req.body.id
      const userid=req.session.user_id
      const productData = await Product.findById(product_id)
      const cartProduct = await cartModel.findOne({ user: userid ,'product.productId':product_id})
      let productPrice= productData.price
  
      if(productData.quantity>0){
        if(cartProduct){
          res.json({failed:false})
        }else{
          const data={
            productId:product_id,
            price:productPrice,
            totalPrice:productPrice,
          }
          console.log(data);
        
        await cartModel.findOneAndUpdate({user:userid},{$set:{user:userid},$push:{product:data}},{upsert:true,new:true})
        res.json({failed:false})
        }
      }else{
        res.json({failed:true})
      }
      }
      else{
        res.json({success:"signup"})
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }


  const showCart=async(req,res)=>{
    try {
      if (req.session.user_id) { 
      const id=req.session.user_id;
      const cartData=await cartModel.findOne({user:id}).populate('product.productId')
      console.log(cartData)
      const subtotal = cartData.product.reduce((acc,val)=> acc+val.totalPrice,0)
  
      if(cartData){
        res.render('cart',{data:cartData,subtotal,id})
      }else{
        res.render('cart')
      }
    }else{
      res.redirect('/login')
    }
  
    } catch (error) {
      console.log(error.message);
    }
  }

  const updateCart=async (req, res) => {
    const product_id = req.body.productId
    const user_id = req.session.user_id
    const count = req.body.count
    console.log(product_id,user_id,count);
    const cartD = await cartModel.findOne({ user: user_id })
    console.log(cartD);
    const updatedCart = await cartModel.findOneAndUpdate(
      { user: user_id, 'product.productId': product_id },
      {
        $inc: {
          'product.$.quantity': count,
          'product.$.totalPrice': count * cartD.product.find(p => p.productId.equals(product_id)).price,
        },
      },
      { new: true }
    );
    res.json({success:true})
  }
  
  const removeCart=async (req, res) => {
    try {
      const { productId, userId } = req.body;
      const updatedCart = await cartModel.findOneAndUpdate({ 'user': userId},{ $pull: { 'product': { 'productId': productId } } },{ new: true });
      if (updatedCart) {
        res.json({success:true});
      } else {
        res.status(404).json({ error: 'Product not found in the cart' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const checkout=async(req,res)=>{
    try {
      const id=req.session.user_id
      console.log(id);
      const address=await addressModel.findOne({user:id})
      console.log(address);
      res.render('checkout',{id,address})
    } catch (error) {
      console.log(error);
    }
  }

  const checkoutPost=async(req,res)=>{
    try {
      const userId=req.query.id
      const {name,address,landmark,state,city,pincode,phone,email}=req.body
      const newAddress = {name,address,landmark,state,city,pincode,phone,email,};
  
        const data = await addressModel.findOneAndUpdate(
        { user: userId },
        { $push: { address: newAddress } },
        { upsert: true, new: true }
      )
  
          res.render('successpage')
    } catch (error) {
      console.log(error);
    }
  }


  module.exports={
    getCart,
    showCart,
    updateCart,
    removeCart,
    checkout,
    checkoutPost
  }

