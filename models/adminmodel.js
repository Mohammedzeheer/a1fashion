const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminname:{type:String,required:true}, 
    adminpassword:{type:String,required:true}
   });

   const admincollection =new mongoose.model("admindatas", adminSchema);
   
   module.exports=admincollection;