const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},   
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"productdatas"},
        quantity:{type:Number},
        totalprice:{type:Number,default:0}       
    }],
    outstock:{type:Boolean,default:false}    
    // grandtotal:{type:Number,default:0},   
} ,{timestamps:true});

   const cartCollection =new mongoose.model("cartdatas", cartSchema);
   
   module.exports=cartCollection;