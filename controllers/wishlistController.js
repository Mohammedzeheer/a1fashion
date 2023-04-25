const cartCollection=require('../models/cartModel')
const mongoose = require('mongoose');
const productcollection = require('../models/productmodel')
const wishlistCollection=require('../models/wishlistModel')




///SHOP CART Page here appear and this function works
var userName
var userId
 const GetWishlist= async (req, res,next) => {
   try {
       userName=req.session.user
       userId=req.session.userid
  
   const wishlistdata=await wishlistCollection.find({userId:userId}).populate("products.productId").lean()
   const [{ products }] = wishlistdata;
  
   const wishList = products.map(({productId}) => ({   
       _id:productId._id, 
       productname:productId.productname, 
       productprice:productId.productprice,
       productimage:productId.productimage,      
}))
  console.log(wishList);
   res.render("wishlist", {user:true, userName, wishList })
   } catch (error) {
        next()
  }
}



const addToWishlist=async(req,res,next)=>{
    try{
       const userid=req.session.userid
       const wishlistData=await wishlistCollection.findOne({userId:userid}).lean()
       if(wishlistData){
        const productfound=await wishlistCollection.findOne({userId:userid, "products.productId": req.query.id}).lean()
        console.log(productfound);
        if(productfound){
            await wishlistCollection.updateOne({userId:userid},{$pull:{products:{productId:req.query.id}}})
            console.log('removed');
        }else{
            await wishlistCollection.findOneAndUpdate({userId:userid},{$addToSet:{products:{productId:req.query.id}}})
            console.log('added');
        }
       }else{
        await wishlistCollection.create({userId:userid,products:{productId:req.query.id}})
        console.log('created');
       }

    }catch(error){
        next()
    }
}

///whishlist delete
const deleteFromWishlist=async (req,res,next)=>{
    try {
      userId=req.session.userid
       wishlistid=req.params.id  
       await wishlistCollection.updateOne({userId:userId},{$pull:{products:{productId:wishlistid}}}) 
       res.redirect('/wishlist')
    } catch (error) {
      next()
    }
  }


module.exports= {addToWishlist,GetWishlist,deleteFromWishlist}




// const GetWishlist1=async(req,res)=>{
//     try{
//         const usersId=req.session.userid;
//         wishlistdata=await wishlistCollection.findOne({userId:usersId}).populate("products.productId").lean()
//         const stocks=await Promise.all(wishlistdata.products.map(async(i)=>{
//             return stocks=await productcollection.findOne({_id:i.productId._id}).lean()
//         }))
//          res.render("wishlist",{user:true,stocks})
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }


// const GetWishlist111= async (req, res,next) => {
//   try {
//       userName=req.session.user
//       userId=req.session.userid
//       console.log(userId);
 
//   const wishlistdata=await wishlistCollection.findOne({userId:userId}).populate("products.productId").lean()
//   const [{ products }] = wishlistdata;

//   if(wishlistdata){
//    if(!wishlistdata.products[0]){
//        res.render("emptyWishlist", {user:true, userName,}) 
//    }
 
//   const wishList = products.map(({productId}) => ({   
//       productname:productId.productname, 
//       productprice:productId.productprice,
//       productimage:productId.productimage,      
// }))
//   console.log(wishlistdata);
//   res.render("wishlist", {user:true, userName, wishList })
// }
//  else{
//    res.render("emptyWishlist", {user:true, userName,}) 
//  }
//   } catch (error) {
//   next()
//  }
// }