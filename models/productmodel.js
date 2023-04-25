const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productname:{type:String,required:true}, 
    productid:{type:String,required:false},
    productprice:{type:String,required:true},
    productcategory:{type:String,required:true},
    productbrand:{type:String,required:false},
    description:{type:String,required:false},
    productimage:{type:Array,required:true},
    stock:{type:Number,default:0},
    date:{type:String,required:true},
    status:{type:Boolean,default:true},
    categorystatus:{type:Boolean,default:true}
    // productadddate:{type:Date,required:true}
   });

   const productcollection =new mongoose.model("productdatas", productSchema);
   
   module.exports=productcollection;