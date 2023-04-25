const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"userdatas"},   
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"productdatas"},     
    }]
} ,{timestamps:true});


   const wishlistCollection =new mongoose.model("wishlistdatas", wishlistSchema);
   module.exports=wishlistCollection;



   