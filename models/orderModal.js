  const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delivery_address:{
    type:Object,
    required:true
  },
  payment: {
    type: String,
    required: true,
    method: ['Cash on delivery', 'Razorpay' , 'Wallet']
  },
  products: [{
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      totalPrice: {
      type: Number,
      default: 0
    },
    productStatus:{
        type: String,
        default: 'pending',
        enum: ['pending','placed', 'delivered', 'cancelled', 'shipped','out-for-delivery','returned']
      },
    cancelReason: {
      type: String
    }
  }],
  subtotal: {
    type: Number,
    required:true
  }
  ,
  orderStatus: {
    type: String,
    default: 'pending',
    enum: ['pending','placed','returned or cancelled']
  }
  ,
  orderDate: {
    type: Date,
    required: true
  },
  wallet:{
    type:Number,
  },
  cancelledProduct:{
    type:Array,
    default:[]
  },
  returnedProduct:{
    type:Array,
    default:[]
  }
})

const Order = mongoose.model('Orders', orderSchema)
module.exports =Order