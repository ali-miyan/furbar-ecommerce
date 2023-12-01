const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const userOTPschema=new Schema({
    user_id:String,
    otp:String,
    createAt:Date,
    expiresAt:Date
})
const userOTP=mongoose.model("userOTP",userOTPschema);

module.exports=userOTP;