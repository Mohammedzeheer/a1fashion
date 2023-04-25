const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    phonenumber:{type:String,required:true},
    email:{type:String,required:true},  
    password:{type:String,required:true},
    blocked:{type:Boolean,default:false},
    usedcoupon:{type:String,required:false},
    wallet:{type:Number,default:0}
   });

   const usercollection =new mongoose.model("userdatas", userSchema);
   
   module.exports=usercollection;
