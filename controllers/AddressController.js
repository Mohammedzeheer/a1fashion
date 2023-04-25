const usercollection = require('../models/usermodel')
const admincollection = require('../models/adminmodel')
const productcollection = require('../models/productmodel')
const categorycollection = require('../models/categorymodel')
const cartCollection=require('../models/cartModel')
const AddressCollection=require('../models/AddressModel')

let userName // USER NAME FOR SHOW HEADER OF PAGE AND CONDITION WOKS 

//HERE THE PAGE USER PROFILE WILL RENDER 
const userprofile = function (req, res, next) {
    try {
     userName=req.session.user
    console.log(userName);
    userdatas={
      uname:userName,
      email:req.session.useremail,
      wallet:req.session.wallet
    }
    res.render('userProfile', { user: true,userName,userdatas });
    } catch (error) {
        res.render('404')
    }  
  }



//HERE INSERTING ADRESS AND UPDATING WHEN SAME USER PROCESS WORK 
const userAddress= async(req,res,next)=>{
    try {
       userid=req.session.userid
       let formData=req.body
       console.log("form data -------------------",formData);

       const userExit = await AddressCollection.findOne({user:userid})
       console.log(userExit);
        if (userExit==null)
        { 
            await AddressCollection.insertMany([{user:userid,address:formData}])
        }
        else{
            await AddressCollection.updateOne({user:userid},{$push:{address:formData}})
        }
        res.redirect('/userProfile')
    } catch (error) {
        //res.render('404')
       console.log(error); 
    }
}



 //HERE GROUP OF ADRESS PAGE WILL RENDER  
const groupAddress = async(req,res,next)=>{
    try {
        userName = req.session.user
        userId=req.session.userid  
        let passAddress=await AddressCollection.findOne({user:userId})  
        res.render('addressGroup',{user:true,userName,passAddress})
    } catch (error) {
        console.log(error);       
    }
}



///CHECKOUT PAGE RENDER AND THIS CODE WILL WORKS 
const checkoutPage = async function (req, res, next) {
    try {
        console.log(passaddresslist);  
        userName = req.session.user
        userId=req.session.userid  
        const cartDataList = await cartCollection.find({userId:userId}).populate("products.productId").lean();
        const [{ products }] = cartDataList;
       
        const checkoutList = products.map(({productId,quantity,totalprice}) => ({   
            _id:productId._id,
            productname:productId.productname, 
            productprice: productId.productprice,
            productimage: productId.productimage,
            quantity,
            totalprice,            
      }))
    
        const subtotal = checkoutList.reduce((total,num)=>total+num.totalprice,0)
        discountvalue=req.session.discountvalue
        const grandtotal=subtotal+66-discountvalue
        res.render('checkout',{user:true,userName,passaddresslist,checkoutList,subtotal,discountvalue,grandtotal});
      
    } catch (error) {
        res.render('404')
    }
}



//HERE ADDRESS PASSES TO CHECKOUT PAGE --------------------------
let passaddresslist
const selectAddress = async(req,res,next)=>{
    try {
        userName = req.session.user
        userId=req.session.userid  
        passid=req.params.indexof        
        let passAddress=await AddressCollection.findOne({user:userId})   
        passaddresslist = passAddress.address[passid]
        console.log(passaddresslist);
  
        res.redirect('/checkout')
    } catch (error) {
        console.log(error);       
    }
}

///ORDERED PAGE RENDER ----------------------
const ordered= (req,res,next)=>{
    try {
        res.render('orderSuccefully', {user:true,userName})
    } catch (error) {
        res.render('404')
    }
  
}


///MODULE EXPORTS TO ROUTER ----------------
module.exports={userAddress,userprofile,groupAddress,selectAddress,checkoutPage,ordered}



