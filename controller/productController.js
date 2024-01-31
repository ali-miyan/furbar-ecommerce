const categoryModel = require('../models/categoryModel');
const Product = require("../models/productModel")
const offerModel = require("../models/offerModel");

const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).populate({
      path: 'categoryId',
      populate: {
        path: 'offer'
      }
    }).populate('offer');
    const offer = await offerModel.find({})

    products.forEach(async (product) => {
      if (product.categoryId.offer) {
        const offerPrice = product.price * (1 - product.categoryId.offer.discountAmount / 100);
        product.discountedPrice = parseInt(offerPrice);
        product.offer = product.categoryId.offer
        await product.save();
      }
      else if (product.offer) {
        const discountedPrice = product.price * (1 - product.offer.discountAmount / 100);
        product.discountedPrice = parseInt(discountedPrice);
        await product.save();
      }
    });

    console.log(products, 'backenddddd');


    res.render('products', { products, offer })
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
}

const addProducts = async (req, res) => {
  try {
    const datas = await categoryModel.find();
    res.render('addproducts', { datas });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const addProductsPost = async (req, res) => {
  try {
    const details = req.body;
    const files = req.files;

    const img = [
      files && files.image1 ? files.image1[0].filename : null,
      files && files.image2 ? files.image2[0].filename : null,
      files && files.image3 ? files.image3[0].filename : null,
      files && files.image4 ? files.image4[0].filename : null,
    ];

    // for (let i = 0; i < img.length; i++) {
    //   if (img[i]) {
    //     await sharp(`public/multerimages/${img[i]}`)
    //       .resize(500, 500)
    //       .toFile(`public/sharpimages/${img[i]}`);
    //   }
    // }

    const product = new Product({
      name: details.name,
      quantity: details.quantity,
      categoryId: details.category,
      price: details.price,
      description: details.description,
      images: {
        image1: img[0],
        image2: img[1],
        image3: img[2],
        image4: img[3],
      },
    });

    const result = await product.save();
    res.redirect('/admin/products');

  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const editProducts = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findOne({ _id: id }).populate('categoryId');
    const categories = await categoryModel.find({ is_blocked: false })

    res.render('editproducts', { data: product, data1: categories });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const editProductsPost = async (req, res) => {
  try {
    const id = req.query.id;
    const details = req.body;
    const files = req.files;

    const existingData = await Product.findOne({ _id: id });

    const img = [
      files?.image1 ? (files.image1[0]?.filename || existingData.images.image1) : existingData.images.image1,
      files?.image2 ? (files.image2[0]?.filename || existingData.images.image2) : existingData.images.image2,
      files?.image3 ? (files.image3[0]?.filename || existingData.images.image3) : existingData.images.image3,
      files?.image4 ? (files.image4[0]?.filename || existingData.images.image4) : existingData.images.image4,
    ];

    // for (let i = 0; i < img.length; i++) {
    //   if (img[i]) {
    //     await sharp(`public/multerimages/${img[i]}`)
    //       .resize(500, 500)
    //       .toFile(`public/sharpimages/${img[i]}`);
    //   }
    // }

    const product = {
      name: details.name,
      quantity: details.quantity,
      categoryId: details.category,
      price: details.price,
      description: details.description,
      images: {
        image1: img[0],
        image2: img[1],
        image3: img[2],
        image4: img[3],
      },
    };

    const result = await Product.findOneAndUpdate({ _id: id }, product, { new: true });
    res.redirect('/admin/products');

  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};


const blockProducts = async (req, res) => {
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
    console.log(error);
    res.status(500).render('500');
  }
}

module.exports = {
  getProduct,
  addProducts,
  addProductsPost,
  editProducts,
  editProductsPost,
  blockProducts
}
