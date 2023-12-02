const mongoose = require("mongoose");
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
    is_list:{
        type:Boolean,
        default:false
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
 })

const categoryModel= mongoose.model("categoryModel",categorySchema);
module.exports=categoryModel