const express = require("express");
const routeAdmin = express();
const config = require("../config/config");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const categoryModel = require('../models/categoryModel');
const adminController = require("../controller/adminConroller");
const orderModel = require('../models/orderModal');
const offerModel = require("../models/offerModel");
const Product = require("../models/productModel");
const path = require('path')
const ejs = require('ejs')
const puppeteer = require('puppeteer')
const ExcelJS = require('exceljs');



const adminLogin = async (req, res) => {
  try {
    res.render('adminlogin')

  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

const loadDashboard = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenue = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$subtotal" }
        }
      }
    ]);

    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);
    const currentMonthName = (new Date()).toLocaleString('default', { month: 'long' });

    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$subtotal" }
        }
      }
    ]);

    const graph = monthlyRevenue.map(entry => entry.monthlyRevenue)
    const graphValue = graph.concat(Array(12 - graph.length).fill(0))
    console.log(graphValue);

    const cashOnDelivery = await orderModel.countDocuments({
      payment: "Cash on delivery",
    });
    
    const razorpay = await orderModel.countDocuments({
      payment: "Razorpay",
    });
    
    const wallet = await orderModel.countDocuments({
      payment: "Wallet",
    });
    

    res.render("adminhome", { totalOrders, totalProducts, revenue, monthlyRevenue,currentMonthName,graphValue,cashOnDelivery,wallet,razorpay});
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const loadUser = async (req, res) => {
  try {
    const userData = await User.find({})
    res.render('users', { users: userData })
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
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
        req.session.admin_id = validAdmin._id;
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminlogin", { message: "incorrect password" });
      }
    } else {
      res.render("adminlogin", { message: "you are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
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
    res.status(500).render('500');
  }
};
//load category
const loadCategory = async (req, res) => {
  try {
    const message = req.query.message
    const offer = await offerModel.find({})
    const category = await categoryModel.find({}).populate('offer')
    res.render('category', { category, message, offer })
  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

//add category
const addCategory = (req, res) => {
  try {
    res.render('addcategory')
  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

//add category post
const addCategoryPost = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const description = req.body.description.trim();
    const validData = await categoryModel.findOne({ name: name })

    if (validData) {
      res.render('addcategory', { message: 'you cant add category with same name' })
    } else {

      const newUser = new categoryModel({
        name: name,
        description: description,
      });

      await newUser.save()
      res.redirect('/admin/category')
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

//edit categoty 
const editCategory = async (req, res) => {
  try {

    const id = req.query.id;
    const userData = await categoryModel.findById({ _id: id });
    if (userData) {
      res.render('editcategory', { data: userData });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

//block category(patch)
const blockCategory = async (req, res) => {
  try {
    const user = req.params.id;
    console.log(user, 'user');
    const categoryProduct = await Product.find({ categoryId: user });
    const userValue = await categoryModel.findOne({ _id: user });
    console.log(userValue);
    if (userValue.is_blocked) {
      await categoryModel.updateOne({ _id: user }, { $set: { is_blocked: false } });
      await Product.updateMany({categoryId:user},{$set:{isCategoryBlocked:false}})
    } else {
      await categoryModel.updateOne({ _id: user }, { $set: { is_blocked: true } });
      await Product.updateMany({categoryId:user},{$set:{isCategoryBlocked:true}})
    }
    console.log(userValue);
    res.json({ blocked: true });  
  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

//edit category post
const editCategoryPost = async (req, res) => {
  try {
    const existingCategory = await categoryModel.findOne({ name: req.body.name });

    if (existingCategory && existingCategory.name === req.body.name) {
      return res.render('editcategory', { message: 'Category name already exists', data: existingCategory });
    }

    await categoryModel.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: { name: req.body.name, description: req.body.description } }
    );

    return res.redirect(`/admin/category?message=${encodeURIComponent('Successfully updated')}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).render('500');
  }
};


const showOrders = async (req, res) => {
  try {
    const orderData = await orderModel.find({})
    res.render('order', { orderData })
  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}


const updateStatus = async (req, res) => {
  try {
    console.log("helooq");
    const { newStatus, productId } = req.body;
    console.log(req.body, "body");
    console.log(productId, 'stat1');
    console.log(newStatus, 'stat');

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


    res.json({ success: true })

  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}


const detailOrder = async (req, res) => {
  try {
    const id = req.query.id
    const orderData = await orderModel.findById(id).populate('products.productId')
    const address = orderData.delivery_address
    const cancelled = await orderData.cancelledProduct
    const returned = await orderData.returnedProduct
    res.render('showorder', { address, orderData, cancelled, returned })

  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
}

const reportPage = async (req,res) => {
  try {
    const orders = await orderModel.find()
    res.render('reportPage',{orders})
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
}


const salesReport = async (req, res) => {
  try {
      console.log('heloooooooooo');
      const orderData = await orderModel.find().populate('products.productId')
      const totalOrders = await orderModel.countDocuments();
      const totalProducts = await Product.countDocuments();
  
      const revenue = await orderModel.aggregate([
        {
          $group: {
            _id: null,
            revenue: { $sum: "$subtotal" }
          }
        }
      ]);

      const ejsPagePath = path.join(__dirname, '../views/admin/report.ejs');
      const ejsPage = await ejs.renderFile(ejsPagePath, { orderData,totalOrders,totalProducts,revenue });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(ejsPage);
      const pdfBuffer = await page.pdf();
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
      res.send(pdfBuffer);

  } catch (error) {
      console.log(error.message);
      res.status(500).render('500');
  }
}

const salesReportExel = async (req, res) => {
  try {
    console.log('heloooooooooo');
    const orderData = await orderModel.find().populate('products.productId');
    const totalOrders = await orderModel.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenue = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$subtotal" }
        }
      }
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.addRow(['Order ID', 'Billing Name', 'Date', 'Total', 'Payment Method']);
    
    orderData.forEach(order => {
      worksheet.addRow([
        order._id,
        order.delivery_address.name,
        order.orderDate,
        order.subtotal,
        order.payment
      ]);
    });

    worksheet.addRow(['', '', '', 'Total Orders:', totalOrders]);
    worksheet.addRow(['', '', '', 'Total Products:', totalProducts]);
    worksheet.addRow(['', '', '', 'Total Revenue:', revenue[0] ? revenue[0].revenue : 0]);

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
    
    res.send(buffer);

  } catch (error) {
    console.log(error.message);
    res.status(500).render('500');
  }
};
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
  detailOrder,
  reportPage,
  salesReport,
  salesReportExel
};
