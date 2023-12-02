const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const categoryModel = require('../models/categoryModel');
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");
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
        const users=await categoryModel.find({})
        res.render('category',{users:users})
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

routeAdmin.get('/blockcategory', async (req, res) => {
    try {
      const user = req.query.id;
      const userValue = await categoryModel.findOne({ _id: user });
      if (userValue.is_list) {
        await categoryModel.updateOne({ _id: user }, { $set: { is_list: false } });
      } else {
        await categoryModel.updateOne({ _id: user }, { $set: { is_list: true } });
      }
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error.message);
    }
  });

  routeAdmin.get('/deletecategory', async (req, res) => {
    try {
      const user = req.query.id;
      const userValue = await categoryModel.findOne({ _id: user });
      if (userValue.is_deleted) {
        await categoryModel.updateOne({ _id: user }, { $set: { is_deleted: false } });
      } else {
        await categoryModel.updateOne({ _id: user }, { $set: { is_deleted: true } });
      }
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error.message);
    }
  });



module.exports = routeAdmin;
