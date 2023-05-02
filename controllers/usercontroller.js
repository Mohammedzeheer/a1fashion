const session = require('express-session')
const nodemailer = require('nodemailer')
// let transporter=nodemailer.createTransport(options,[defaults])
const { options } = require('../app')
const usercollection = require('../models/usermodel')
const admincollection = require('../models/adminmodel')
const productcollection = require('../models/productmodel')
const categorycollection = require('../models/categorymodel')
const bannerCollection=require('../models/bannerModel')
const ordercollection=require('../models/orderModel')
const { localsAsTemplateData } = require('hbs')
let msg
let userfind
let userName
// let user


//<<<<<<<<<<<<<<    USER HOME PAGE   >>>>>>>>>>
const indexpage = async function (req, res, next) {
  console.log(userName);
  try {
    const itemsPerPage = 4;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await productcollection.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;

    let bannerShow=await bannerCollection.find().lean()
    let producttable = await productcollection.find().skip(startIndex).limit(itemsPerPage).lean();
    res.render('userhome', { user: true, userName ,producttable,bannerShow,totalPages,currentPage: page});

  } catch (error) {
    console.log(error)
    res.render('404')
  }
   
}


//<<<<<<<<<<<<<<    USER login PAGE GET   >>>>>>>>>>
const loginpage = function (req, res, next) {
  res.render('userlogin', { userlogin: true, msg },);
  msg = null;
}


//<<<<<<<<<<<<<<   USER SIGN UP PAGE GET RENDER  >>>>>>>>>>
const signupPage = function (req, res, next) {
  try {
    res.render('usersignup', { userlogin: true});
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}


//<<<<<<<<<<<<<<   USER LOGIN POST METHOD   >>>>>>>>>>
let userID;
const userlogin = async function (req, res, next) {
   try {
      let userdata = {
        email: req.body.email,
        password: req.body.password
      }
      userfind = await usercollection.findOne({ email: userdata.email })
 
      if (userfind == null) {   
      res.render('userlogin',{msg:"Invalid Data",userlogin: true})   
    }
     else if(userfind.blocked==true){    
      res.render('userlogin',{msg:"You are blocked",userlogin: true})
      }
      else if (userfind.password == userdata.password) {
        userName = userfind.name //here added for to see the name of user in the page 
        req.session.user = userfind.name //added for session 
        req.session.userid = userfind._id //added for session 
        req.session.useremail = userfind.email //added for session 
        req.session.wallet = userfind.wallet //added for session 
  
        console.log(userfind._id);
        res.redirect('/')
      }
      else if (userfind.password != userdata.password) {
        msg = "Invalid password"
        res.redirect('/login')       
      } 
   } catch (error) {
    console.log(error)
    res.render('404')
   }
}




//<<<<<<<<<<<<<<  USER SIGNUP POST    >>>>>>>>>>
let data;
const usersignup = function (req, res, next) {
try {
  data = {
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    email: req.body.email,
    password: req.body.password
  }
  async function userexist() {
    let usercheck = await usercollection.findOne({ email: data.email })
    if (usercheck) {
      msg = "Account Already Exist Please login"
      res.redirect('/login')
    } else {
      await otpcheck(data);
      res.redirect('/otp')
      //  usercollection.insertMany([data])      
    }
  }
  userexist()
}
  catch (error) {
    console.log(error)
    res.render('404')
  }
} 
  


//<<<<<<<<<<<<<<  OTP PAGE RENDER   >>>>>>>>>>
let otperror;
const otppage = function (req, res, next) {
  try {
    res.render('otp', { otp: true, otperror });
    otperror = ""
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}




//<<<<<<<<<<<<<<  WHEN USER SIGNUP OTP PAGE APPEAR AND THIS FUNCTION WORKS >>>>>>>>>>
let OtpCode;
const otpcheck = async function (req, res, next) {
   try {
    console.log(data);
    OtpCode = Math.floor(100000 + Math.random() * 988800)
    otp = OtpCode
    otpEmail = data.email
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPassword,
      }
    })
    let docs = {
      from: "fammsstore11@gmail.com",
      to: otpEmail,
      subject: "A1 Fashion Varification",
      html: `<p style="font-size:24px;font-weight:bold;">${OtpCode}</p><p> A1 Fashion verification code, Do not share with others</p>`  
    }
  
    mailTransporter.sendMail(docs, (err) => {
      if (err) {
        console.log(err)
      }
    })
   } catch (error) {
    console.log(error)
    res.render('404')
   }
}


//<<<<<<<<<<<<<<  SUBMIT BUTTON OF OTP PAGE >>>>>>>>>>
const otpsubmit = async function (req, res, next) {
  try {
    const check = req.body.otp;
    const join = check.join('')
    if (OtpCode == join) {
      let hello= await usercollection.insertMany([data])
      console.log(hello)
      req.session.user = data.name
      userName = data.name
      req.session.userid = data._id //added for session 
      req.session.useremail = data.email //added for session 
      req.session.wallet = data.wallet //added for session    
      res.redirect('/') 
    }
    else {
      otperror = "Otp is not matched"
      res.redirect('/otp')
    }
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}



//<<<<<<<<<<<<<<  RESEND OTP   >>>>>>>>>>
const resendotp = async function (req, res, next) {
  try {
    await otpcheck();
    res.redirect('/otp')
  } catch (error) {
    console.log(error)
    res.render('404')
  } 
}



//<<<<<<<<<<<<<<  SHOP PAGE DISPLAY and products Showing from admin added  >>>>>>>>>>
let categorydropdown
const productshowuser = async function (req, res, next) { 
 try {
    const itemsPerPage = 6;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await productcollection.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    categorydropdown = await categorycollection.find().lean()
    let producttable = await productcollection.find().skip(startIndex).limit(itemsPerPage).lean();
 
  res.render('shop', { producttable, categorydropdown, user: true, userName,totalPages,currentPage: page});

 } catch (error) {
  console.log(error)
    res.render('404')
 }
}
  

  
  //<<<<<<<<<<<<<<<<<<<<<<  FILTERING PRODUCT CATEGORY BASE  >>>>>>>>>>
  const categoryFilter= async function (req,res,next){  
    try {
      const categoryname=req.query.catname
      const itemsPerPage = 6;
      const page = parseInt(req.query.page) || 1;
      const totalItems = await productcollection.countDocuments();
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const producttable= await productcollection.find({productcategory:categoryname}).skip(startIndex).limit(itemsPerPage).lean();
      if(producttable){
        res.render('shop', { producttable, categorydropdown, user: true, userName,totalPages,currentPage: page }); 
      }
       else{
        res.redirect("/shop")
       } 
    } catch (error) {
      console.log(error)
    res.render('404')
    }
  }



  //<<<<<<<<<<<<<<<<  SHOP DETAIL PAGE RENDER   >>>>>>>>>>
  const shopdetails = async function (req, res, next) {
  try {
    let shopdetailtable = await productcollection.findOne({ _id: req.query.id })
    const { _id,productcategory,productname, productimage ,productprice,description} = shopdetailtable
    res.render('shopDetails', {_id,productcategory, productimage,productname,productprice,description, user: true, userName, });
  
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}
   


//<<<<<<<<<<<<<<<<<  ABOUT PAGE RENDER  >>>>>>>>>>
const aboutpage = function (req, res, next) {
  try {
    res.render('about', { user: true ,userName});
  } catch (error) {
    res.render('404')
  } 
}

//<<<<<<<<<<<<<<<<<<  CONTACT PAGE RENDER  >>>>>>>>>>
const contactPage = function (req, res, next) {
  try {
    res.render('contact', { user: true,userName});
  } catch (error) {
    console.log(error)
    res.render('404')
  }
 
}

//<<<<<<<<<<<<<<<<<<<<<<  BLOG PAGE RENDER   >>>>>>>>>>
const blogPage = function (req, res, next) {
  try {
    res.render('blog', { user: true ,userName });
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}


//<<<<<<<<<<<<<<<<<<<<<< USER LOGOUT  >>>>>>>>>>
const logout = function (req, res, next) {
  res.render('userhome', { user: true });
  userName = ""
  // req.session.user = null
  req.session =null
}


const fortesting = function (req, res, next) {
  res.render('testing', {user:true});
}


//<<<<<<<<<<<<<<<<<<<<<<  CONFIRM ORDER BY ADMIN   >>>>>>>>>>
const confirmOrder= async (req,res,next)=>{
  try{
      id=req.session.userid    
      confirmid = req.params.id
      
      await ordercollection.updateOne({_id:confirmid},{status:"Shipped"})
       
    res.redirect('/order')
   }
   catch(error){
    console.log(error)
    res.render('404')
   }
}


//<<<<<<<<<<<<---ADMIN MAKE STATUS SHIPPED TO DELIVERD --->>>>>>>>>>>>>>>>>>>> 
const makeDeliveredByAdmin = async (req, res, next) => {
  try {
    id = req.session.userid
    confirmid = req.params.id

    await ordercollection.updateOne({ _id: confirmid }, { status: "Delivered" })

    res.redirect('/order')
  }
  catch (error) {
    console.log(error)
    res.render('404')
  }
}



//<<<<<<<<<<<<---USER REQUESTING TO RETURN --->>>>>>>>>>>>>>>>>>>> 
const addToReturn = async (req,res,next)=>{
  try{
     id=req.session.userid  
    //  returnid = req.params.id
     returnid = req.query.id
     returnreason = req.query.reason
     
     await ordercollection.updateOne({_id:returnid},{status:"Return Requested",reason:returnreason})
     await ordercollection.updateOne({_id:returnid},{returnstatus:false})
      
   res.redirect('/orderUser')
  }
  catch(error){
    console.log(error)
    res.render('404')
  }
}

//<<<<<<<<<<<<---CANCEL ORDER BY USER --->>>>>>>>>>>>>>>>>>>> 
const cancelOrder = async (req,res,next)=>{
  try{
     id=req.session.userid
     returnid = req.query.id
     cancelreason = req.query.reason

   const data=  await ordercollection.find({_id:returnid})
  
   const paymentCheck=data[0].paymentmethod
   const grandtotal=data[0].grandtotal

   if(paymentCheck=="PayPal" || paymentCheck=="wallet" ){
    await usercollection.updateOne({_id:id},{$inc:{wallet:grandtotal}})
   }  
 
     await ordercollection.updateOne({_id:returnid},{status:"Order Canceled",reason:cancelreason})
     await ordercollection.updateOne({_id:returnid},{returnstatus:false})
   res.redirect('/orderUser')
  }
  catch(error){
    console.log(error)
    res.render('404')
  }
}

//<<<<<<<< ADMIN RETURN CONFIRMATION FUNCTION >>>>>>>>>
const returnConfirm = async (req,res,next)=>{
   try{
      id=req.session.userid
      addWalletPrice=req.params.grandtotal     
      returnid = req.params.id
      await usercollection.updateOne({_id:id},{$inc:{wallet:addWalletPrice}})

      await ordercollection.updateOne({_id:returnid},{status:"Return Confirmed"})
      await ordercollection.updateOne({_id:returnid},{returnstatus:false})
       
    res.redirect('/order')
   }
   catch(error){
    console.log(error)
    res.render('404')
   }
}


//<<<<<<<< CANCEL ORDER BY ADMIN >>>>>>>>>
const cancelOrderByAdmin = async (req,res,next)=>{
  try{
     id=req.session.userid
     addWalletPrice=req.params.grandtotal     
     returnid = req.params.id
     const data=  await ordercollection.find({_id:returnid})
     const paymentCheck=data[0].paymentmethod

     if(paymentCheck=="PayPal" || paymentCheck=="wallet" ){
      await usercollection.updateOne({_id:id},{$inc:{wallet:addWalletPrice}})
     } 
     await ordercollection.updateOne({_id:returnid},{status:"Order Canceled"})
     await ordercollection.updateOne({_id:returnid},{returnstatus:false})
      
   res.redirect('/order')
  }
  catch(error){
    console.log(error)
    res.render('404')
  }
}


 //<<<<<<<< WELCOME MESSAGE TO USER >>>>>>>>>
const welcomeMessageUser= async function (req, res, next) {
  try {
   userEmail=req.body.email
   console.log("email testing",userEmail)
   otpEmail = userEmail
   let mailTransporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: process.env.nodemailerEmail,
       pass: process.env.nodemailerPassword,
     }
   })
   let docs = {
     from: "fammsstore11@gmail.com",
     to: otpEmail,
     subject: "A1 Fashion",
     html: "<h1 style='color: #cc0066; font-family: Arial, sans-serif;'>Welcome to A1 Fashion!</h1><p style='font-size: 16px; line-height: 1.5; color: #333;'>We offer trendy and stylish clothing to make you feel confident and comfortable. Our friendly customer service team is always here to help. Happy shopping!</p>"
    }
    
   mailTransporter.sendMail(docs, (err) => {
     if (err) {
       console.log(err)
     }
   })
   res.redirect('/')
  //  res.json({ status: true })
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}






///EXPORTS THE FUNCTION TO ROUTERS 
module.exports = {
  indexpage, aboutpage, loginpage,
  userlogin, usersignup, shopdetails,
  otppage, otpsubmit, resendotp, logout, productshowuser,categoryFilter,
  fortesting,signupPage,contactPage,blogPage,cancelOrderByAdmin,addToReturn,cancelOrder,
  confirmOrder,returnConfirm,makeDeliveredByAdmin,
  welcomeMessageUser
   
}