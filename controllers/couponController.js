 const couponcollection =require ('../models/couponModel')  //COUPON MODEL
 const usercollection=require('../models/usermodel')   //USER MODEL


 
  /// <<<<<<<<<<<<< COUPON PAGE RENDER FUNCTION >>>>>>>>>>>>>>>>>>>
 const coupenPage= async (req,res,next)=>{
   try {
      let coupentable= await couponcollection.find().lean() 
      console.log("coupen table ddddd",coupentable)   
      res.render('coupon',{coupentable,admin:true,coupon:true})
   } catch (error) {
      console.log(error);
      res.render('404')
   }
 }
 
   
    /// <<<<<<<<<<<<< ADD COUPON FORM RENDER  >>>>>>>>>>>>>>>>>>>
 const addCoupenPage=(req,res,next)=>{
   try {
      res.render('addCoupon',{admin:true}) 
   } catch (error) {
      console.log(error);
      res.render('404')
   }
 }


    /// <<<<<<<<<<<<< ADD COUPON FUNCTION SUBMIT BUTTON  >>>>>>>>>>>>>>>>>>>
 const addCoupenPost=async (req,res,next)=>{
      try {
         const coupondata={
            couponcode:req.body.couponcode,
            discounttype:req.body.discounttype,
            discountvalue:req.body.discountvalue,
            maxdiscountamount:req.body.maxdiscountamount,
            minpurchase:req.body.minpurchase,
            startingdate:req.body.startingdate,
            expiredate:req.body.expiredate,      
         }
         await couponcollection.insertMany([coupondata])
         res.render('addCoupon',{admin:true}) 
      } catch (error) {
         console.log(error);
         res.render('404')
      }   
 }


     
    /// <<<<<<<<<<<<< USER CHECKING IN COUPON INUT FEALD >>>>>>>>>>>>>>>>>>>
const userTryCouponCode=async(req,res,next)=>{
    try {
      const couponId = req.body.couponcode
      let couponError =""     
      
      let usedCouponCheck = await usercollection.findOne ({ _id: req.session.userid, usedcoupon: { $in: [couponId] } }) 

      if (usedCouponCheck==null){
         let couponCheck = await couponcollection.findOne({ couponcode: couponId }) 

         if (couponCheck){
         const date= new Date().toLocaleString()
         subtotal=req.session.subtotal
         if (date > couponCheck.expiredate && couponCheck.status==true && subtotal>=couponCheck.minpurchase){
         req.session.coupon = couponId
         } else {
            couponError= "Invalid Couponcode"
            req.session.couponError=couponError
         }
         }       
         else{
            couponError= "Invalid Couponcode"
            req.session.couponError=couponError
         }
      }
      else{couponError ="This Coupen Is Already Used" }
      req.session.couponError=couponError
       res.redirect('/shoppingCart')
      }            
     catch (error) {
      console.log(error);
      res.render('404')
         
    }
   }

   
    /// <<<<<<<<<<<<< DELETE COUPON BY ADMIN FUNCTION  >>>>>>>>>>>>>>>>>>>
const deleteCoupon= async (req,res,next)=>{ 
   try {
      let coupondlt=req.params.id    
         await couponcollection.deleteOne({_id:coupondlt})    
         res.redirect('/coupenPage');
   } catch (error) {
      console.log(error);
      res.render('404')
   }      
}


    /// <<<<<<<<<<<<< MODULE EXPORTS  >>>>>>>>>>>>>>>>>>>
 module.exports={
    coupenPage,addCoupenPage,addCoupenPost,userTryCouponCode,
    deleteCoupon
 }