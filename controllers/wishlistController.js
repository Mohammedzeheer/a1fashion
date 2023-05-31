const mongoose = require('mongoose');
const wishlistCollection=require('../models/wishlistModel')




///SHOP CART Page here appear and this function works

 const GetWishlist= async (req, res,next) => {
   try {
      let userName=req.session.user
      let userId=req.session.userid
  
   const wishlistdata=await wishlistCollection.find({userId:userId}).populate("products.productId").lean()
 
   if (!wishlistdata.length) {
    res.render('emptyWishlist', { user: true, userName })
  }
  let [{ products }] = wishlistdata;
  if (products.length == 0) {
    res.render('emptyWishlist', { user: true, userName })
  }

else{
   const wishList = products.map(({productId}) => ({   
       _id:productId._id, 
       productname:productId.productname, 
       productprice:productId.productprice,
       productimage:productId.productimage,      
}))
  console.log(wishList);
   res.render("wishlist", {user:true, userName, wishList })
 }
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}



const addToWishlist=async(req,res,next)=>{
    try{
       const userid=req.session.userid
       const wishlistData=await wishlistCollection.findOne({userId:userid}).lean()
       if(wishlistData){
        const productfound=await wishlistCollection.findOne({userId:userid, "products.productId": req.query.id}).lean()
        console.log("wishlist sdaidfdf",productfound);
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
      console.log(error)
    res.render('404')
    }
}

///whishlist delete
const deleteFromWishlist=async (req,res,next)=>{
    try {
      let userId=req.session.userid
       wishlistid=req.params.id  
       await wishlistCollection.updateOne({userId:userId},{$pull:{products:{productId:wishlistid}}}) 
       res.redirect('/wishlist')
    } catch (error) {
      console.log(error)
    res.render('404')                                                                                                                                                                                                                                                                                                                                                                                                                                              
    }
  }


module.exports= {addToWishlist,GetWishlist,deleteFromWishlist}