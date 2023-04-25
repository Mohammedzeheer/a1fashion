const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
     couponcode:{type:String,required:true},
     discounttype:{type:String,required:true},
     discountvalue:{type:Number,required:true},
     maxdiscountamount:{type:Number},
     minpurchase:{type:Number,required:true},
     startingdate:{type:String,required:true},
     expiredate:{type:String,required:true},
     status:{type:Boolean,default:true},
    //  coupenid:{type:String,required:false},
   });

   const couponcollection =new mongoose.model("coupendatas", couponSchema);
   
   module.exports=couponcollection;