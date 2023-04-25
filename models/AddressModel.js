const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,required:true},
    address:{type:Array,required:true},  
   });

   const userAddressCollection =new mongoose.model("userAddressDatas", userAddressSchema);
   
   module.exports=userAddressCollection;
