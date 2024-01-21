const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

 const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    offer: {
        type: ObjectId,
        ref:'offerModel',
    },
    discountedPrice:Number
    ,
    is_blocked:{
        type:Boolean,
        default:false
    }
 })
 
const categoryModel= mongoose.model("categoryModel",categorySchema);
module.exports=categoryModel