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

const getCart=async(req,res)=>{
    try {
      if(req.session.user_id){
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
        orderDate: new Date(), // Include orderDate
      });
    
      for (const item of orderItems) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } }
        );
      }
    
      await cartModel.updateOne(
        { user: userId },
        { $set: { product: [] } } // Clear the products array in the cart
      );
    
      await order.save();
      res.render('successpage');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
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

