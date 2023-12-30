const mongoose = require('mongoose')
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true

    },
    verfied:{
      type:Boolean,
      default:false

    },
    isAdmin:{
        type:Number
    },
    is_blocked: {
        type: Boolean,
        default:false
    },
    wallet: {
        type: Number,
        default: 0
    }
});

const User =mongoose.model('User',userSchema);

module.exports=User;