const usercollection=require('../models/usermodel')
const admincollection=require('../models/adminmodel')
const productdatas=require('../models/productmodel')
const categorycollection=require('../models/categorymodel')
const cartCollection=require('../models/cartModel')
const mongoose = require('mongoose');
const productcollection = require('../models/productmodel')
const couponcollection=require('../models/couponModel')
const { render } = require('express/lib/response')
// const { products } = require('./productcontroller')


//CART PAGE RENDER 
const shopCart= async(req,res,next)=>{
    try {
        res.render('shoppingCart',{user:true})     
    } catch (error) {
      console.log(error)
      res.render('404')
    }
}

///SHOP CART Page here appear and this function works
let userName
let userId
const userGetShopCart = async (req, res, next) => {
  try {
    userName = req.session.user
    userId = req.session.userid
    couponError = req.session.couponError

    const cartDataList = await cartCollection.find({ userId: userId }).populate("products.productId").lean();

    console.log("cartDataList", cartDataList)

    if (!cartDataList.length) {
      res.render('emptyCart', { user: true, userName })
    }
    let [{ products }] = cartDataList;
    if (products.length == 0) {
      res.render('emptyCart', { user: true, userName })
    }
    else {
      const cartList = products.map(({ productId, quantity, totalprice }) => ({
        _id: productId._id,
        productname: productId.productname,
        productprice: productId.productprice,
        productimage: productId.productimage,
        stock: productId.stock,
        quantity,
        totalprice,
      }))
      req.session.cartList = cartList
      const takeOnlyTotalprice = products.map(({ totalprice }) => ({
        totalprice,
      }))

      const subtotal = takeOnlyTotalprice.reduce((total, num) => total + num.totalprice, 0)
      req.session.subtotal = subtotal
      let grandtotal
      const coupondiscount = await couponcollection.findOne({ couponcode: req.session.coupon })
      console.log("coupen discout addff", coupondiscount)
      discountvalue = 0
      if (coupondiscount) {
        discountvalue = coupondiscount.discountvalue
        grandtotal = subtotal + 66 - discountvalue

      }
      else {
        grandtotal = subtotal + 66
      }
      req.session.discountvalue = discountvalue
      req.session.grandtotal = grandtotal

      res.render("shoppingCart", { user: true, userName, cartList, subtotal, discountvalue, grandtotal, couponError })
    }

  } catch (error) {
    console.log(error)
    res.render('404')
  }
} 




 ///// <<<<<<<<<<<<< ADD TO CART FUNCTION  >>>>>>>>>>>>>>>>>>>
const addToCart=async(req,res,next)=>{
    try {
      const productid=req.query.id;
      const userid= req.session.userid;

     const cart=await cartCollection.findOne({userId:userid}).lean();
  
     console.log(cart);
     const stock = await productcollection.findOne({_id:productid}).lean()
     console.log("stock value ............",stock)
     req.session.products=stock
      let price=stock.productprice
      if(stock.stock<=0)
      return res.json({message:'sorry product is out of stock'})
      if(cart){
        productexist = await cartCollection.findOne({userId:userid,"products.productId":productid})
        if(productexist){
          await cartCollection.updateOne({userId:userid,"products.productId":productid},{$inc:{"products.$.quantity":1,"products.$.totalprice":price}})
  
        }else{
            await cartCollection.findOneAndUpdate({userId:userid},{$push:{products:{productId:productid,quantity:1,totalprice:price}}});}
      }else{
        await cartCollection.create({userId:userid,products:{productId:productid,quantity:1,totalprice:price}})
      }
      res.json({status:true})
    } catch (error) {
      console.log(error)
      res.render('404')
      
    }}




  // <<<<<<<<<<<<< DELETE FROM CART >>>>>>>>>>>>>>>>>>>
 const deleteFromcart=async (req,res,next)=>{
  try {
    userId=req.session.userid
    cartid=req.query.id   
     const haah=await cartCollection.updateOne({userId:userId},{$pull:{products:{productId:cartid}}}) 
     console.log(haah);
     
    //  res.json({status:true})
     res.redirect('/shoppingCart')
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}




 // <<<<<<<<<<<<< UPDATE QUANTITY WHILE CLICKING PLUS MINUS >>>>>>>>>>>>>>>>>>>
const updateQuantity = async (req, res) => {
  try {

    const id = req.params.id;
    const quantity=parseInt(req.body.count)
      userId=req.session.userid

      const stock =req.body.stock

      if(quantity<=stock){
      const product=await productcollection.findOne({_id:id})

      const totalprice= product.productprice*quantity

      await cartCollection.updateOne({userId:userId,"products.productId":id},{$set:{"products.$.quantity":quantity,"products.$.totalprice":totalprice}})
      await cartCollection.updateOne({userId:userId},{$set:{outstock:false}})


      const cartDataList = await cartCollection.find({userId:userId}).populate("products.productId").lean();
      const [{ products }] = cartDataList;
    
      const cartList = products.map(({productId,quantity,totalprice}) => ({   
          _id:productId._id,
          productname:productId.productname, 
          productprice: productId.productprice,
          productimage: productId.productimage,
          quantity,
          totalprice,            
    }))
      
     const subtotal = cartList.reduce((total,num)=>total+num.totalprice,0)
     let grandtotal
     const coupondiscount = await couponcollection.findOne({couponcode:req.session.coupon})
     discountvalue=0
      if(coupondiscount)
      {
        discountvalue=coupondiscount.discountvalue
        grandtotal=subtotal+66-discountvalue
 
      }
     else{
      grandtotal=subtotal+66
     }
     res.json({status:true,
      data: {
          totalprice:totalprice,
          subtotal:subtotal,
          grandtotal: grandtotal,
          nodata:""
        }
  })
      }else{
          res.json({status:false,message:"Out of stock"})
          await cartCollection.updateOne({userId:userId},{$set:{outstock:true}})
      }    
   
  } catch (error) {
    console.log(error)
    res.render('404')
  }
};


//MODULE EXPORTS
module.exports={shopCart,addToCart,userGetShopCart,deleteFromcart,updateQuantity}