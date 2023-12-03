const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
const { trusted } = require("mongoose");
// const auth=require('../middleware/auth')

routeAdmin.set("view engine", "ejs");
routeAdmin.set("views", "./views/admin");

routeAdmin.get("/", adminController.adminLogin);

routeAdmin.get("/blockuser", adminController.blockUser);

routeAdmin.get("/users", adminController.loadUser);

routeAdmin.get("/dashboard",adminController.loadDashboard);

routeAdmin.post("/signin", adminController.loadSignin);

routeAdmin.get('/category',async(req,res)=>{
    try {
      const message=req.query.message
        const users=await categoryModel.find({})
        res.render('category',{users:users,message:message})
    } catch (error) {
        console.log(error.message);
    }
})

routeAdmin.get('/addcategory',(req,res)=>{
    res.render('addcategory')
})

routeAdmin.post('/addcategory',async(req,res)=>{
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
})

routeAdmin.get('/editcategory',async(req,res)=>{
  try {

    const id = req.query.id;
    const userData = await categoryModel.findById({ _id: id });
        if (userData) {
            res.render('editcategory', { data: userData });
        }
  } catch (error) {
    console.log(error.message);
  }
})
routeAdmin.patch('/blockcategory/:id', async (req, res) => {
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
});

routeAdmin.post('/editcategory',async(req,res)=>{
  try {
    await categoryModel.findByIdAndUpdate(
        { _id: req.body.id },
        { $set: { name: req.body.name, description: req.body.description } }
    );
    res.redirect(`/admin/category?message=${'successfully added'}`)
}  catch (error) {
    console.log(error.message);
  }
})


module.exports = routeAdmin;
