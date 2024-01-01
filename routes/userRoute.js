const express = require("express");
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
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
const orderController=require('../controller/orderController')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');


const routeUser = express();

routeUser.use(
  session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false,
  })
);



routeUser.use(express.urlencoded({ extended: true }));
routeUser.use(express.json());

routeUser.set("view engine", "ejs");
routeUser.set("views", "./views/user");

routeUser.get("/", userController.loadHome);

routeUser.get("/shop", userController.loadShop);

routeUser.get("/profile", userController.loadProfile);

routeUser.get("/signup", auth.isLogout, userController.loadSignup);

routeUser.post("/signup", auth.isLogout, userController.signupPost);

routeUser.get("/verifyOTP", userController.verifyOTP);

routeUser.post("/verifyOTP",userController.verifyPost);

routeUser.get("/login", auth.isLogout, userController.loadLogin);

routeUser.post("/login", auth.isLogout, userController.loginPost);

routeUser.get("/logout",auth.isLogin,userController.userLogout);

routeUser.get('/detailshop',userController.detailShop)

routeUser.post('/getcart',auth.isLogin,cartController.getCart)

routeUser.get('/showcart',auth.isLogin,cartController.showCart)

routeUser.post('/updatecart',auth.isLogin,cartController.updateCart);

routeUser.post('/removecart',auth.isLogin,cartController.removeCart);

routeUser.get('/checkout',auth.isLogin,orderController.checkout)

routeUser.post('/checkoutform',auth.isLogin,orderController.checkoutPost)

routeUser.post('/addressform',auth.isLogin,userController.addressform);

routeUser.post('/editaddress',userController.editAddress);

routeUser.post('/deleteaddress',userController.deleteAddress)

routeUser.get('/detailorder',userController.detailOrder)

routeUser.post('/cancelorder',userController.cancelOrder)

routeUser.post('/edituser',userController.editUser)


routeUser.get('/successpage',async(req,res)=>{
  try {
    const orderID=req.query.id;
    const orderData=await orderModel.findOne({_id:orderID})
    res.render('successpage',{orderData})
  } catch (error) {
    console.log(error.message);
  }
})

function generatePDF(order,productsInOrder) {
  const doc = new PDFDocument();
  const stream = new PassThrough();
  const buffers = [];

  doc.pipe(stream);

  stream.on('data', (chunk) => {
    buffers.push(chunk);
  });

  stream.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers);
  });

  // const dataURI = `/sharpimages/${productsInOrder[0].images.image1}`;

const productDetailsArray = Object.values(productsInOrder);

const productNames = [];

for (const product of productDetailsArray) {
  productNames.push(product.name);
}

  doc.text(`Order ID: ${order._id}`);
  doc.text(`Order Date: ${order.orderDate}`);
  doc.text(`Delivery address: ${order.delivery_address}`);
  doc.text(`Payment method: ${order.payment}`);
  doc.text(`Total price: ${order.subtotal}`);
  doc.text(`Order Date: ${order.orderDate}`);
  doc.text(`Product details: ${productNames}`);
  // doc.image(dataURI,{ width: 200, height: 200 });

    doc.end();

  return stream;
}

routeUser.get('/orderdetail/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId);


    const fetchProductDetails = async () => {
      const productDetails = [];
    
      for (const product of order.products) {
        const productId = product.productId;
    
        try {
          const productInfo = await Product.findById(productId);
          productDetails.push(productInfo);
        } catch (error) {
          console.error(`Error fetching product details for product ID ${productId}: ${error.message}`);
        }
      }
    
      return productDetails;
    };
    const productsInOrder = await fetchProductDetails();

    if (!order || !productsInOrder) {
      return res.status(404).send('Order not found');
    }

    const pdfStream = generatePDF(order,productsInOrder);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=order_details.pdf');
    pdfStream.pipe(res);

  } catch (error) {
    console.error(error); 
    res.status(500).send('Internal Server Error');
  }
});

routeUser.post('/shippingamount',async (req,res)=>{
  try{
    const id = req.session.user_id
    const option = req.body.option
    const amount = req.body.amount
    const cartData = await cartModel.findOneAndUpdate({user:id},{$set:{shippingMethod:option,shippingAmount:amount}})
    res.json({success:true})
    
  }catch(error){
    console.log(error.message);
    res.render('500Error')
  }
})

routeUser.post('/verifypayment',orderController.verifypayment)



module.exports = routeUser;
