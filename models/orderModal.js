const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user:{
   type:mongoose.Types.ObjectId
  },
  deliveryDetails: {
    type: Object,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
        ref: "Product",
      },
      count: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
      }
    },
  ],
  
  cancelReason: {
    type: String
  },
  returnReason: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  orderId: {
    type: String,
  },
  paymentId: {
    type: String
  },
  shippingMethod: {
    type: String,
  },
  shippingAmount: {
    type: Number,
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports =Order