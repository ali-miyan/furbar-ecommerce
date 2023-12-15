const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const addressSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"User",
        required:true,
    },
    address:[{
        fisrtName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
          },
          landmark: {
            type: String,
            required: true
          },
          state: {
            type: String,
            required: true
          },
          city: {
            type: String,
            required: true
          },
          pincode: {
            type: String,
            required: true
          },
          phone: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          }
    }]
    
})


const addressModel = mongoose.model('addressModel',addressSchema)
module.exports=addressModel