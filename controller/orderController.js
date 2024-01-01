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
const Razorpay = require('razorpay');
const dotenv = require('dotenv')
dotenv.config()
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id:process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});


const checkout=async(req,res)=>{
    try {
      const id=req.session.user_id
      const cartData = await cartModel.findOne({user:id}).populate('product.productId')    
      const address = await addressModel.findOne({user:id})
      const total = cartData.product.reduce((acc,val)=>acc+val.totalPrice,0)
      const subtotal=total+cartData.shippingAmount
      res.render('checkout',{id,address,cartData,subtotal})
    } catch (error) {
      console.log(error);
    }
  }

  const checkoutPost = async (req, res) => {
    try {
      console.log("hrloooooooo",req.body);
      const userId = req.session.user_id;
      const user=await User.findOne({_id:userId})
      let addressObject;
      const selectedAddress = req.body.selectedAddress;
      const paymentMethod = req.body.payment;
      const cartData = await cartModel.findOne({ user: userId });

      let status=paymentMethod=="Cash on delivery"?"placed":"pending"

      const orderItems = await cartData.product.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.quantity * product.price,
        productStatus:status
      }));

      const total = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
      const totalPrice = total + cartData.shippingAmount
      console.log(totalPrice,"totalprice");
      console.log("statuesssssssss",);


      if (paymentMethod == "Wallet") {
        if(user.wallet>=totalPrice){
        const reduce = user.wallet - totalPrice;
        status = "placed";
        await User.findOneAndUpdate(
          {_id:user},
          {
            $set: { wallet: reduce },
          }
        )
        res.json({wallet:true})
        }else{
          res.json({wallet:false})
        }
      }

  
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
          addressObject = userAddress.address[0];
        }


      
      

      console.log("productsssssss",orderItems);

      const order = new orderModel({
        user: userId,
        delivery_address: addressObject,
        payment: paymentMethod, 
        products: orderItems,
        subtotal: totalPrice,
        status: status,
        orderDate: new Date(), 
      });
    
      await order.save();
      const orderId = order._id;

      if(order.status=="placed"){
        console.log("placeeddddddddddddddd");
        for (const item of orderItems) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { quantity: -item.quantity } }
          );
        }
        await cartData.deleteOne({ user: user._id });
        res.json({orderId,success:true})
      }else{
        var options = {
          amount: totalPrice * 100,
          currency: "INR",
          receipt: "" + orderId,
        };
        console.log('heloooooooooooo');

        razorpay.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          }
          console.log("errorrr",order);
          res.json({success:false, order });
        });
      }
      // res.redirect(`/successpage?id=${orderId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };


  const verifypayment=async(req,res)=>{
    try {

      const id = req.session.user_id;
      const Data = req.body
      console.log(Data);
      const cartData = await cartModel.findOne({ user: id });
  
      const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
      hmac.update(Data.razorpay_order_id + "|" + Data.razorpay_payment_id);
      const hmacValue = hmac.digest("hex");
  
      if (hmacValue == Data.razorpay_signature) {
          for (const Data of cartData.product) {
            const { productId, quantity } = Data;
            await Product.updateOne({ _id: productId }, { $inc: { quantity: -quantity } });
          }
      }
      const newoOrder=await orderModel.findByIdAndUpdate(
        { _id: Data.order.receipt }, 
        { $set: { status: "placed" } }
      );
      const orderId=await newoOrder._id
  
      await cartData.deleteOne({ user: id });
      console.log("iddddddddddd"+orderId);
      res.json({orderId, success: true });
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports={
    checkout,
    checkoutPost,
    verifypayment
  }