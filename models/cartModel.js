const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"User",
        require:true,
    },
    product : [{
        productId:{
            type:ObjectId,
            ref:"Product",
            required:true,
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
            default:0
        },
        totalPrice:{
            type:Number,
            default:0
        }

    }],
  shippingMethod: {
    type: String,
    default:"free-shipping",
  },
  shippingAmount: {
    type: Number,
    default:0,
  }
})


const cartModel= mongoose.model("cartModel",cartSchema)
module.exports=cartModel