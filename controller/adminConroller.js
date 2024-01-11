const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const categoryModel = require('../models/categoryModel');
const adminController = require("../controller/adminConroller");
const orderModel=require('../models/orderModal')


const adminLogin=async(req,res)=>{
    try {
        res.render('adminlogin')

    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
  try {
    res.render("adminhome");
  } catch (error) {
    console.log(error);
  }
};

const loadUser=async(req,res)=>{
    try {
        const userData=await User.find({})
        res.render('users',{users:userData})
    } catch (error) {
        console.log(error);
    }
}

const loadSignin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const validAdmin = await User.findOne({ email: email });
    if (validAdmin && validAdmin.isAdmin == 1) {
      const passwordMatch = await bcrypt.compare(password, validAdmin.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        req.session.admin_id=validAdmin._id;
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminlogin", { message: "incorrect password" });
      }
    } else {
      res.render("adminlogin", { message: "you are not an admin" });
    }
  } catch (error) {
    console.log(error);
  }
};



const blockUser = async (req, res) => {
  try {
    const user = req.params.id;
    const userValue = await User.findOne({ _id: user });
    if (userValue.is_blocked) {
      await User.updateOne({ _id: user }, { $set: { is_blocked: false } });
      req.session.user_id = null;
    } else {
      await User.updateOne({ _id: user }, { $set: { is_blocked: true } });
    }
    res.json({ block: true });
  } catch (error) {
    console.log(error.message);
  }
};
//load category
const loadCategory=async(req,res)=>{
  try {
    const message=req.query.message
      const users=await categoryModel.find({})
      res.render('category',{users:users,message:message})
  } catch (error) {
      console.log(error.message);
  }
}

//add category
const addCategory=(req,res)=>{
  try {
    res.render('addcategory')
  } catch (error) {
    console.log(error.message);
  }
}

//add category post
const addCategoryPost=async(req,res)=>{
  try {
  const name=req.body.name.trim();
  const description=req.body.description.trim();
  const validData=await categoryModel.findOne({name:name})

  if(validData){
      res.render('addcategory',{message:'you cant add category with same name'})
  }else{

  const newUser = new categoryModel({
      name: name,
      description:description,
  });

  await newUser.save()
  res.redirect('/admin/category')
}

  } catch (error) {    
  console.log(error.message);
  } 
}

//edit categoty 
const editCategory=async(req,res)=>{
  try {

    const id = req.query.id;
    const userData = await categoryModel.findById({ _id: id });
        if (userData) {
            res.render('editcategory', { data: userData });
        }
  } catch (error) {
    console.log(error.message);
  }
}

//block category(patch)
const blockCategory=async (req, res) => {
  try {
    const user = req.params.id; 
    const userValue = await categoryModel.findOne({ _id: user });
    if (userValue.is_list) {
      await categoryModel.updateOne({ _id: user }, { $set: { is_list: false } });
    } else {
      await categoryModel.updateOne({ _id: user }, { $set: { is_list: true } });
    }
    res.json({ block: true });
  } catch (error) {
    console.log(error.message);
  }
}
//edit category post
const editCategoryPost=async(req,res)=>{
  try {

    const existingCategory = await categoryModel.findOne({ name: req.body.name });
    console.log(existingCategory.name);
    console.log(req.body.name);

    if (existingCategory && existingCategory.name === req.body.name) {
       res.render('editcategory', { message: 'Category name already exists' });
    }

    await categoryModel.findByIdAndUpdate(
        { _id: req.body.id },
        { $set: { name: req.body.name, description: req.body.description } }
    );
    res.redirect(`/admin/category?message=${'successfully added'}`)
}  catch (error) {
    console.log(error.message);
  }
}

const showOrders=async(req,res)=>{
  try {
      const orderData=await orderModel.find({})
      res.render('order',{orderData})
  } catch (error) {
      console.log(error.message);
  }
}


const updateStatus = async(req,res)=>{
  try {
      console.log("helooq");
      const {newStatus,productId} = req.body;
      console.log(req.body,"body");
      console.log(productId,'stat1');
      console.log(newStatus,'stat');

      const updatedOrder = await orderModel.findOneAndUpdate(
          { 
              'products._id': productId
          },
          {
              $set: {
                  'products.$.productStatus': newStatus
              }
          },
          { new: true }
      );


      res.json({success:true})

  } catch (error) {
      console.log(error.message);
  }
}


const detailOrder = async(req,res)=>{
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
}



module.exports = {
  loadDashboard,
  loadSignin,
  loadUser,
  adminLogin,
  loadCategory,
  addCategory,
  addCategoryPost,
  editCategory,
  blockCategory,
  editCategoryPost,
  blockUser,
  showOrders,
  updateStatus,
  detailOrder

};
