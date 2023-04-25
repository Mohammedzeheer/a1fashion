const mongoose=require ('mongoose')

const bannerSchema= new mongoose.Schema({
     seasontitle:{type:String,required:true},
     title:{type:String,required:true},
     bannerimage:{type:Array,required:true},
     description:{type:String,required:true},
     status:{type:String,default:true}
}) 

const bannerCollection =new mongoose.model("bannerdatas", bannerSchema);
module.exports=bannerCollection;



   