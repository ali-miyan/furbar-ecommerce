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
const orderModel=require('../models/orderModal')
const wishlistModel = require('../models/wishlistModel')

const getCart=async(req,res)=>{
    try {
      if(req.session.user_id){
      const product_id=req.body.id
      const userid=req.session.user_id
      const productData = await Product.findById(product_id)
      const cartProduct = await cartModel.findOne({ user: userid ,'product.productId':product_id})
      let productPrice = productData.discountedPrice ? productData.discountedPrice : productData.price;
  
      if(productData.quantity>0){
        if(cartProduct){
          res.json({status:'alreadyAdded',cartProduct})
        }else{
          const data={
            productId:product_id,
            price:productPrice,
            totalPrice:productPrice,
          }
          console.log(data);
        
        await cartModel.findOneAndUpdate({user:userid},{$set:{user:userid},$push:{product:data}},{upsert:true,new:true})
        res.json({success:true})
        
        }
      }
      // else{
      //   res.json({failed:true})
      // }
      }
      else{
        res.json({failed:true})
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }


  const showCart=async(req,res)=>{
    try {
      console.log("heloooooooooo");
      if (req.session.user_id) { 
      const id=req.session.user_id;
      const cartData=await cartModel.findOne({user:id}).populate('product.productId')
      console.log("cartdata",cartData)
      
        
      if(cartData){
        const subtotal = cartData.product.reduce((acc, val) => acc + (val.discountedPrice || val.price) * val.quantity, 0);
        console.log("cart");
        const total = subtotal+cartData.shippingAmount
        res.render('cart',{data:cartData,subtotal,id,total})
      }else{
        console.log("cartt");
        res.render('cart',{data:"hi"})
      }
    }else{
      res.redirect('/login')
    }
  
    } catch (error) {
      console.log(error.message);
    }
  }

  const updateCart=async (req, res) => {
    try {
      
      const user_id = req.session.user_id
      const product_id = req.body.productId
      const count = req.body.count
    const productCount=await Product.findOne({_id:product_id})
    console.log("ppppppppppppppppppppp",productCount);
    const cartD = await cartModel.findOne({ user: user_id })
    console.log(cartD);

    if (count === -1) {
      const currentQuantity = cartD.product.find((p) => p.productId == product_id).quantity;
      if (currentQuantity <= 1) {
          return res.json({ success: false, message: 'Quantity cannot be decreased further.' });
      }
  }

    if (count === 1) {
      const currentQuantity = cartD.product.find((p) => p.productId == product_id).quantity;
      if (currentQuantity + count > productCount.quantity) {
          return res.json({ success: false, message: 'Stock limit reached' });
      }
  }


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

      } catch (error) {
          console.log(error);
      }
      

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

  const shippingAmount = async (req, res) => {
    try {
      const id = req.session.user_id
      const option = req.body.option
      const amount = req.body.amount
      const cartData = await cartModel.findOneAndUpdate({ user: id }, { $set: { shippingMethod: option, shippingAmount: amount } })
      res.json({ success: true })
  
    } catch (error) {
      console.log(error.message);
    }
  }


  const getWishlist = async (req, res) => {
    try {
        const product_id = req.body.id;
        const userId = req.session.user_id;
        const wishListProducts = await wishlistModel.findOne({ user: userId, 'product.productId': product_id });
  
        if (wishListProducts) {
          await wishlistModel.findOneAndUpdate(
            { user: userId, 'product.productId': product_id },
            { $pull: { 'product': { 'productId': product_id } } }
          );
          res.json({ remove: true, message: 'Product removed from wishlist' });
        } else {
          const data = {
            productId: product_id,
          };

          await wishlistModel.findOneAndUpdate(
            { user: userId },
            { $addToSet: { product: data } },
            { upsert: true, new: true }
          );
          res.json({ add: true, message: 'Product added to wishlist' });
        }

    } catch (error) {
      console.log(error.message);
    }
  };

  const wishlist = async(req,res)=>{
    try {
      const data = await wishlistModel.findOne({}).populate('product.productId');
      res.render('wishlist',{data})
    } catch (error) {
      console.log(error);
    }
  }
  

  const removeWishlist=async (req, res) => {
    try {
      const { productId,userId } = req.body;
      console.log(req.body,'ddddddddddddddddddd');
      const wishlist = await wishlistModel.findOneAndUpdate({ 'user': userId},{ $pull: { 'product': { 'productId': productId } } },{ new: true });
      console.log(wishlist);
      if (wishlist) {
        res.json({success:true});
      } else {
        res.json({ error: 'Product not found in the cart' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports={
    getCart,
    showCart,
    updateCart,
    removeCart,
    shippingAmount,
    getWishlist,
    wishlist,
    removeWishlist
  }

