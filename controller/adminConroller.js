const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const adminController = require("../controller/adminConroller");

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
        // req.session.admin_id=validAdmin._id;
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
    const user = req.query.id;
    const userValue = await User.findOne({ _id: user });
    if (userValue.is_blocked) {
      await User.updateOne({ _id: user }, { $set: { is_blocked: false } });
      req.session.user_id = null;
    } else {
      await User.updateOne({ _id: user }, { $set: { is_blocked: true } });
    }
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadDashboard,
  loadSignin,
  blockUser,
  loadUser,
  adminLogin
};
