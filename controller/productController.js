const express = require("express");
const routeAdmin = express();
const sharp = require("sharp")
const config = require("../config/config");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const categoryModel = require('../models/categoryModel');
const adminController = require("../controller/adminConroller");
const Product=require("../models/productModel")

const getProduct=async(req,res)=>{
    try {
        const users=await Product.find({})
        console.log(users);
        res.render('products',{products:users})
    } catch (error) {
        console.log(error.message);
    }
}

const addProducts=async(req,res)=>{
    try {
        const datas = await categoryModel.find()
        res.render('addproducts',{datas})
    } catch (error) {
        console.log(error.message);
    }
}

const addProductsPost=async(req,res)=>{
    try {
        const details=req.body;
        console.log(details);
        const files=await req.files;
        console.log(files);
        const img = [
          files?.image1 ? files.image1[0].filename : null,
          files?.image2 ? files.image2[0].filename : null,
          files?.image3 ? files.image3[0].filename : null,
          files?.image4 ? files.image4[0].filename : null,
      ];
          for (let i = 0; i < img.length; i++) {
            if (img[i]) {
            await sharp("public/multerimages/" + img[i])
              .resize(500, 500)
              .toFile("public/sharpimages/" + img[i]);
            }
          }
          if (details.quantity > 0 && details.price > 0) {
            const product = new Product({
              name: details.name,
              quantity: details.quantity,
              category: details.category,
              price: details.price,
              offer: details.offer,
              description: details.description,
              "images.image1": files.image1[0].filename,
              "images.image2": files.image2[0].filename,
              "images.image3": files.image3[0].filename,
              "images.image4": files.image4[0].filename,
            });
            const result=await product.save();
            res.redirect("/admin/products");
        }
    } catch (error) {
        console.log(error.message);

      }
}


const editProducts=async(req,res)=>{
    try {
        const id=req.query.id
        const data=await Product.findOne({_id:id})
        const data1=await categoryModel.find({})

    res.render('editproducts',{data:data,data1:data1})
    } catch (error) {
        console.log(error.message);
    }
}

const editProductsPost=async(req,res)=>{
    try {
        id=req.query.id
        console.log(id);
        const details=req.body;
        const files= req.files;

        console.log('Files:', files);
        
        const existingData = await Product.findOne({ _id: id });

        const img = [
            files?.image1 ? (files.image1[0]?.filename || existingData.images.image1) : existingData.images.image1,
            files?.image2 ? (files.image2[0]?.filename || existingData.images.image2) : existingData.images.image2,
            files?.image3 ? (files.image3[0]?.filename || existingData.images.image3) : existingData.images.image3,
            files?.image4 ? (files.image4[0]?.filename || existingData.images.image4) : existingData.images.image4,
        ];
          
          for (let i = 0; i < img.length; i++) {
            if (img[i]) {
            await sharp("public/multerimages/" + img[i])
              .resize(500, 500)
              .toFile("public/sharpimages/" + img[i]);
            }
          }
          if (details.quantity > 0 && details.price > 0) {
            const product = ({
              name: details.name,
              quantity: details.quantity,
              category: details.category,
              price: details.price,
              offer: details.offer,
              description: details.description,
              "images.image1": img[0],
              "images.image2": img[1], 
              "images.image3": img[2],
              "images.image4": img[3],
            });
            const result = await Product.findOneAndUpdate({ _id: id }, product, { new: true });
            res.redirect("/admin/products");
        }
    } catch (error) {
        console.log(error.message);
    }
}


const blockProducts=async(req,res)=>{
    try {
      const user = req.params.id; 
      const userValue = await Product.findOne({ _id: user });
      if (userValue.is_blocked) {
        await Product.updateOne({ _id: user }, { $set: { is_blocked: false } });
      } else {
        await Product.updateOne({ _id: user }, { $set: { is_blocked: true } });
      }
      res.json({ block: true });
    } catch (error) {
      console.log(error.message);
    }
  }

module.exports={
    getProduct,
    addProducts,
    addProductsPost,
    editProducts,
    editProductsPost,
    blockProducts

}
