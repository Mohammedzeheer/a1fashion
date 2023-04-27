const cartCollection = require('../models/cartModel');
const ordercollection=require('../models/orderModel');
const usercollection = require('../models/usermodel');
const productcollection = require('../models/productmodel');
const {v4:uuidv4} = require('uuid');        //AUTO ID REQUIRE
const Razorpay = require('razorpay');   //RAZORPAY REQUIRE

    /// <<<<<<<<<<<<< RAZORPAY INSTANCE >>>>>>>>>>>>>
var instance = new Razorpay({
  key_id: process.env.razarPayId,
  key_secret: process.env.razorPaySecret
});


let userName
const saveOrder= async function (req,res, next){
   userID= req.session.userid
}



  /// <<<<<<<<<<<<< ALL ORDER POST FUNCTION WORKS HERE   >>>>>>>>>>>>>>>>>>>
let orders
const userPostOrderListPass = async function (req, res, next) {
  try {
    couponId=req.session.coupon
  
    let status ="Order Processing"
    let delivery = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      state: req.body.state,
      pincode: req.body.pincode,
      district:req.body.district,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      address:req.body.address
    } 
  
    payment = req.body.paymentmethod
    grandtotal = req.session.grandtotal;
    userName=req.session.user
    userId = req.session.userid
    orderdate = new Date().toLocaleString();
    let deldt=new Date()
    deliverydate=new Date(deldt.setDate(deldt.getDate() + 7))
    deliverydate=deliverydate.toLocaleString()
    status = status
    let OrderId = uuidv4()
    returnstatus=true
    product=req.session.cartList

      
    if (req.body.paymentmethod === 'PayPal') {
    
      await usercollection.updateOne({_id:req.session.userid},{$addToSet:{usedcoupon:couponId}})
      orders = {
        deliveryaddress: delivery,
        paymentmethod: payment,
        grandtotal: grandtotal,
        ordereduser: userName,
        product: req.session.cartList,
        orderdate: orderdate,
        status: status,
        returnstatus:returnstatus        
      }

      var options = {
        amount: grandtotal * 100,
        currency: "INR",
        receipt: "" + OrderId
      };


      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err)
        } else {
          res.json({ status: true, order: order })
        }
      })
      
    }
     else if (req.body.paymentmethod === 'COD')  
    {
      console.log("Iam COD here");
      await ordercollection.insertMany([{ deliveryaddress: delivery, paymentmethod: payment, grandtotal: grandtotal, ordereduser: userName, product: product,status:status, orderdate: orderdate,deliverydate:deliverydate,returnstatus:true}])
      
      // res.json({ status: false })
      res.render('orderSuccessfully', {user:true,userName})
      
      await usercollection.updateOne({_id:req.session.userid},{$addToSet:{usedcoupon:couponId}})
      await cartCollection.findOneAndDelete({ userId: req.session.userid })
    }
     else if (req.body.paymentmethod === 'wallet')  {
      console.log("Iam Wallet here");
      const userwallet=await usercollection.findOne({_id:req.session.userid})
      walletprice=userwallet.wallet
      console.log("Wallet price",walletprice);

      if(grandtotal>walletprice)
      {
          console.log("you cant buy wallet price is less")         
          res.json({ status: false })
          // res.redirect('/checkout')
      }

      else{       
        await ordercollection.insertMany([{ deliveryaddress: delivery, paymentmethod: payment, grandtotal: grandtotal, ordereduser: userName, product: product,status:status, orderdate: orderdate,deliverydate:deliverydate,returnstatus:true}])
        // res.json({ status: false })
        res.render('orderSuccessfully', {user:true,userName})
        await usercollection.updateOne({_id:req.session.userid},{$addToSet:{usedcoupon:couponId}})
        await cartCollection.deleteOne({ userId: req.session.userid })
    
        const price=walletprice-grandtotal
        await usercollection.updateOne({_id:req.session.userid},{$set:{wallet:price}})
      }   
    }
    else{
      res.json({status:"checkboxSelectError"})
    }
  } catch (error) {
    console.log(error);
    res.render('404')
  } 
  }
  


    /// <<<<<<<<<<<<< REAZOR PAY VERIFY FUNCTION WORKS FROM AJAX CHECKOUT PAGE  >>>>>>>>>>>>>>>>>>>
  const userGetverifypayment = async function (req, res, next) {
    try {
      user = req.session.userid
    if (user) {
      let raz = req.body
      console.log(raz);
     
      const crypto = require('crypto');
     
      let hmac = crypto.createHmac('sha256', 'Cugb61J6aW4RDHkir2MAm4mS')
     
      hmac.update(raz['payment[razorpay_order_id]'] + '|' + raz['payment[razorpay_payment_id]']);
      
      hmac = hmac.digest('hex')
      
     
      if (hmac == raz['payment[razorpay_signature]']) {
        
        let order = orders
        console.log("orders---------------",order);
        order.orderdate = new Date()
        order.orderdate = order.orderdate.toLocaleString()
        let dt = new Date()
        order.deliverydate = new Date(dt.setDate(dt.getDate() + 7))
        order.deliverydate = order.deliverydate.toLocaleString()

        await ordercollection.insertMany([order])
        await cartCollection.deleteOne({ userId: req.session.userid })
        req.session.user.order = null;
        res.json({ PaymentSuccess: true }) 
      }
  
    } else {
      res.redirect('/')
    }
    } catch (error) {
      console.log(error);
      res.render('404')
    }
  }



  //<<<<<<<<<<<<<<--HERE ORDER SHOWS TO ADMIN-->>>>>>>>>>>>>>>>>>>>>>>
const orderAdminView= async(req,res,next)=>{
  try {
    let orderview=await ordercollection.find().sort({orderdate:-1}).lean()
    res.render('order',{orderview,admin:true,orders:true})
  } catch (error) {
    console.log(error);
    res.render('404')
  }
}


  //<<<<<<<<<<<<<<--HERE ORDER PRODUCT VIEW  SHOWS TO ADMIN-->>>>>>>>>>>>>>>>>>>>>>>
let orderid
const orderAdminProductView= async (req,res,next)=>{
  try {
    orderid =req.params.id   
     console.log(orderid);
     let orderProductView= await ordercollection.findOne({_id:orderid}).lean()
     console.log("orderProductView----------------------------",orderProductView);

     const productlist=orderProductView.product
     console.log(productlist);

     res.render('orderProduct',{productlist,admin:true})
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}


  //<<<<<<<<<<<<<<--HERE ORDER SHOWS TO USER-->>>>>>>>>>>>>>>>>>>>>>>
const orderUserPage=async(req,res,next)=>{
  try {
    userName=req.session.user
    userid=req.session.userid
    let userorder=await ordercollection.find({ordereduser:userName}).sort({orderdate:-1}).lean()
    res.render('orderUser',{user:true,userorder,userName})
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}

//<<<<<<<<<<<<<<-- USER SIDE ORDER PRODUCT VIEW PAGE-->>>>>>>>>>>>>>>>>>>>>>>
const orderProductView=async (req,res,next)=>{
  try{    
     userName=req.session.user
     let orderid=req.query.id

     let orderProductView = await ordercollection.findOne({_id : orderid })
     const userOrderProductList = orderProductView.product
      res.render('orderProductView',{userOrderProductList,user:true,userName})

  }catch(error){
    console.log(error)
    res.render('404')
  }
}

////<<<<<<<<<<<<<<--ORDER SUCCESSFULLY PAGE RENDER -->>>>>>>>>>>>>>>>>>>>>>>
const orderSuccessfully=async (req,res,)=>{
  try {
    res.render('orderSuccessfully',{user:true,userName})
  } catch (error) {
    res.render('404')
  }
}


 ////<<<<<<<<<<<<<<--ADMIN GET SALES REPORT PAGE -->>>>>>>>>>>>>>>>>>>>>>>
const salesReport=async (req,res,next)=>{
  try {   
    let salesReportView= await ordercollection.aggregate([{$match:{status:"Delivered"}},{ $sort: { deliverydate: -1 } }])
    if(req.session.report)
    {
      salesReportView = req.session.report
      res.render('salesReport',{admin:true,salesReportView,salesreport:true})
    }
    else{
      res.render('salesReport',{admin:true,salesReportView,salesreport:true})
    }  
  } catch (error) {
    console.log(error);
    res.render('404')
  }
}



////<<<<<<<<<<<<<<--DAILY MONTHLY YEARLY SALES REPORT FUNCTION SUBMIT HERE  -->>>>>>>>>>>>>>>>>>>>>>>
const salesReportDailyMonthly= async (req,res,next)=>{
  try {
  
    salesParam = req.query.name
    console.log(salesParam);

    if (salesParam == "day") {
       
        const today = new Date();
        const todayDate = today.toLocaleDateString();

        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowDate = tomorrow.toLocaleDateString();

        // Output the dates
        console.log(todayDate);
        console.log(tomorrowDate);

      const dailysalesReport= await ordercollection.aggregate([{$match:{status:"Delivered"}},{$match: {
        deliverydate: { $gte: todayDate, $lte: tomorrowDate }
    }}])
            console.log("salesReportView:",dailysalesReport)


        req.session.report = dailysalesReport
    } else if (salesParam == "month"){

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toLocaleDateString();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toLocaleDateString();
      
        console.log(firstDayOfMonth);
        console.log(lastDayOfMonth);
 
        const monthlysalesReport= await ordercollection.aggregate([{$match:{status:"Delivered"}},{$match: {
          deliverydate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }}}])
       
       
        console.log(monthlysalesReport);   
        req.session.report = monthlysalesReport
       
    }else{
      lifetimesalesReport= await ordercollection.aggregate([{$match:{status:"Delivered"}}])     
      }

    res.redirect('/salesReport')

}
   catch (error) {
    console.log(error);
    res.render('404')
    
  }
}



module.exports={saveOrder,userPostOrderListPass,
              orderAdminView,
              orderAdminProductView,
              userGetverifypayment,
              orderUserPage,
              orderProductView,
              orderSuccessfully,
              salesReport,
              salesReportDailyMonthly
            }