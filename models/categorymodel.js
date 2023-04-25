const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
     categoryname:{type:String,required:true},
     status:{type:Boolean,default:true} 
   });

   const categorycollection =new mongoose.model("categories", categorySchema);
   
   module.exports=categorycollection;