const mongoose = require("mongoose");

const orderSchema= new mongoose.Schema({
    // ordereduser:{type:mongoose.Schema.Types.ObjectId,required:true}, 
    ordereduser:{type:String,required:true}, 
    deliveryaddress:{
        firstname:{type:String},
        lastname:{type:String},
        country:{type:String},
        state:{type:String},
        pincode:{type:Number},
        district:{type:String},
        phonenumber:{type:Number},
        email:{type:String},
        address:{type:String},
    },
    grandtotal:{type:Number,required:true},
    product:{type:Array,required:true},
    orderdate:{type:String,required:true},
    paymentmethod:{type:String,required:true},
    deliverydate:{type:String,required:true},
    status:{type:String,required:true},
    returnstatus:{type:Boolean,default:true},
    salesdate:{type:String,required:false},
    reason:{type:String,required:false}   
})
  
const ordercollection =new mongoose.model("orderdatas", orderSchema);
module.exports=ordercollection;