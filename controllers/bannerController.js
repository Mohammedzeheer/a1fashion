
const bannerCollection=require('../models/bannerModel')

//BANNER TABLE PAGE FUNCTION
const bannerPage = async (req,res,next)=>{
  try {
    let bannerTable=await bannerCollection.find().lean()
    res.render('banner',{bannerTable,admin:true})
  } catch (error) {
    next()
  }
}

//ADD BANNER PAGE POPUP
const addBannerGet = async (req,res,next)=>{
  try {
    res.render('addBanner',{admin:true})
  } catch (error) {
    console.log(error)
  } 
}

//BANNER ADD POST FUNCTION 
const bannerAdd=async (req,res,next)=>{
 try {
  bannerdata={
    seasontitle:req.body.seasontitle,
    title:req.body.title,
    description:req.body.description,
    bannerimage:req.file.filename
  } 
  console.log("banerdata..fffffffffffffffffffffffff.....",bannerdata);     
   await  bannerCollection.insertMany([bannerdata])
   res.redirect('/bannerPage')
 } catch (error) {
  console.log(error)
 }
}


  module.exports={
    bannerPage,bannerAdd,addBannerGet
  }
