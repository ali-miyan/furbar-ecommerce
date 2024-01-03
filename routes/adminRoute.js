const express = require("express");
const routeAdmin = express();
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
const orderModel=require('../models/orderModal')
const couponModel=require('../models/couponModel')


// const auth=require('../middleware/auth')

routeAdmin.set("view engine", "ejs");
routeAdmin.set("views", "./views/admin");

routeAdmin.get("/",auth.isAdminLogout,adminController.adminLogin);

routeAdmin.patch('/blockusers/:id',adminController.blockUser)

routeAdmin.get("/users",auth.isAdminLogin,adminController.loadUser);

routeAdmin.get("/dashboard",auth.isAdminLogin,adminController.loadDashboard);

routeAdmin.post("/",auth.isAdminLogout,adminController.loadSignin);

routeAdmin.get('/category',auth.isAdminLogin,adminController.loadCategory);

routeAdmin.get('/addcategory',auth.isAdminLogin,adminController.addCategory)

routeAdmin.post('/addcategory',auth.isAdminLogin,adminController.addCategoryPost)

routeAdmin.get('/editcategory',auth.isAdminLogin,adminController.editCategory)

routeAdmin.post('/editcategory',auth.isAdminLogin,adminController.editCategoryPost)

routeAdmin.patch('/blockcategory/:id',adminController.blockCategory)

routeAdmin.get('/products',auth.isAdminLogin,productController.getProduct)

routeAdmin.get('/addproducts',auth.isAdminLogin,productController.addProducts)

routeAdmin.post('/addproducts',multer.uploadproduct,productController.addProductsPost)

routeAdmin.get('/editproducts',auth.isAdminLogin,productController.editProducts)

routeAdmin.post('/editproducts',multer.uploadproduct,productController.editProductsPost)

routeAdmin.patch('/blockproducts/:id',productController.blockProducts)

routeAdmin.get('/orders',adminController.Orders)



routeAdmin.get('/coupon',async(req,res)=>{
    try {
      const coupon = await couponModel.find({})
      res.render('coupon',{coupon})
      
    } catch (error) {
        console.log(error.message);
    }
})

routeAdmin.get('/addcoupon',async(req,res)=>{
    try {
        res.render("addcoupon")
    } catch (error) {
        console.log(error.message);
    }
}
)

routeAdmin.post('/addcoupon',async (req,res)=>{
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
})

routeAdmin.get('/editcoupon',async (req,res)=>{
    try {
        const couponId = req.query.id;
        const coupon = await couponModel.findById(couponId)
        res.render("editcoupon",{coupon})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
})
routeAdmin.post('/editcoupon',async (req,res)=>{
    try {
        const couponId = req.query.id
        const couponData = await couponModel.findOneAndUpdate({_id:couponId},
            {
                name:req.body.couponname,
                couponCode:req.body.couponcode,
                discountAmount:req.body.discount,
                activationDate:req.body.activationdate,
                expiryDate:req.body.expirydate,
                criteriaAmount:req.body.criteriamount,
            })
    
            res.redirect("/admin/coupon")

    } catch (error) {
        console.log(error.message);
    }
}
)



routeAdmin.patch('/blockcoupon/:id',async(req,res)=>{
    try {
      const user = req.params.id; 
      const userValue = await couponModel.findOne({ _id: user });
      if (userValue.is_blocked) {
        await couponModel.updateOne({ _id: user }, { $set: { is_blocked: false } });
      } else {
        await couponModel.updateOne({ _id: user }, { $set: { is_blocked: true } });
      }
      res.json({ block: true });
    } catch (error) {
      console.log(error.message);
    }
  })

  routeAdmin.post('/admin/updatestatus',async(req,res)=>{
    try {
        console.log("helooq");
        const { orderId, newStatus } = req.body;
        console.log(req.body,"body");
        const orderData=await orderModel.findById(orderId)


        const updatedOrder = await orderModel.findOneAndUpdate(
            { _id: orderId },
            {
                $set: {
                    orderStatus: newStatus,
                    "products.$[].productStatus": newStatus
                }
            },
            { new: true }
        );

        res.json({success:true})

    } catch (error) {
        console.log(error.message);
    }
  })


  routeAdmin.get('/showorder',async(req,res)=>{
    try {
        const id=req.query.id
        const orderData=await orderModel.findById(id).populate('products.productId')
        const address=orderData.delivery_address
        const cancelled=await orderData.cancelledProduct
        const returned = await orderData.returnedProduct
        res.render('showorder',{address,orderData,cancelled,returned})
    } catch (error) {
        console.log(error.message);
    }
  })

module.exports = routeAdmin;
