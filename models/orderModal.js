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
    method: ['Cash on delivery', 'Razorpay']
  },
  products: {
    item: [{
      productId: {
        type: mongoose.Types.ObjectId,
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
    }
  }]
  },
  // status: {
  //   type: String,
  //   default: 'Attempted',
  //   enum: ['Attempted', 'Success', 'Cancelled', 'Failed']
  // },
  isOrder: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Order = mongoose.model('Orders', orderSchema)
module.exports =Order