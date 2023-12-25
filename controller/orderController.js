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


const checkout=async(req,res)=>{
    try {
      const id=req.session.user_id
      const cartData = await cartModel.findOne({user:id}).populate('product.productId')    
      let address = await addressModel.findOne({user:id})
      const subtotal = cartData.product.reduce((acc,val)=>acc+val.totalPrice,0)
      res.render('checkout',{id,address,cartData,subtotal})
    } catch (error) {
      console.log(error);
    }
  }

  const checkoutPost=async(req,res)=>{
    try {
      const userId = req.session.user_id;
      let addressObject;
      const selectedAddress = req.body.selectedAddress;
    
      if (selectedAddress === undefined || selectedAddress === null) {
        const { name, address, landmark, state, city, pincode, phone, email } = req.body;
        const newAddress = { name, address, landmark, state, city, pincode, phone, email };
        
        const data = await addressModel.findOneAndUpdate(
          { user: userId },
          { $push: { address: newAddress } },
          { upsert: true, new: true }
        );
        addressObject = data.address[data.address.length - 1];
      } else {
        const userAddress = await addressModel.findOne(
          { 'address._id': selectedAddress },
          { 'address.$': 1 }
        );
        addressObject = userAddress.address[0]
      }
    
      const cartData = await cartModel.findOne({ user: userId });
      const subtotal = cartData.product.reduce((acc, val) => acc + val.totalPrice, 0);
    
      const orderItems = cartData.product.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.quantity * product.price,
      }));
    
      const order = new orderModel({
        user: userId,
        delivery_address: addressObject,
        payment: 'Cash on delivery',
        products: orderItems,
        subtotal: subtotal,
        status: 'Success',
        orderDate: new Date(), 
      });
    
      for (const item of orderItems) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } }
        );
      }
    
      await cartModel.updateOne(
        { user: userId },
        { $set: { product: [] } }
      );
  
      await order.save();
      const orderId=order._id;

      res.redirect(`/successpage?id=${orderId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
    
  }

  module.exports={
    checkout,
    checkoutPost
  }