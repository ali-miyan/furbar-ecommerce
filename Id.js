// const mongoose = require('mongoose');
// const Product = require('./models/productModel');
// const Category = require('./models/categoryModel');

// async function updateProductCategoryIds() {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         const products = await Product.find();
//         const categories = await Category.find({}, '_id name');

//         for (const product of products) {
//             const category = categories.find((c) => c.name === product.category);

//             if (category) {
//                 console.log(`Updating product ${product.name} (id: ${product._id}) with categoryId: ${category._id}`);
//                 product.categoryId = category._id;

//                 try {
//                     await product.save();
//                     console.log(`Product ${product.name} (id: ${product._id}) updated successfully.`);
//                 } catch (error) {
//                     console.error(`Error updating product ${product.name} (id: ${product._id}):, error`);
//                 }
//             } else {
//                 console.log(`Category not found for product ${product.name} (id: ${product._id}), skipping.`);
//             }
//         }

//         console.log('Product categoryIds update successful.');

//     } catch (error) {
//         console.error('Product categoryIds update failed:', error);

//     } finally {
//         // Close the database connection
//         mongoose.connection.close();
//     }
// }

// // Run the migration
// updateProductCategoryIds();