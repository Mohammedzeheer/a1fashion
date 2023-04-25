var express = require('express');
const nocache = require("nocache");
// var router = express.Router();
var adminrouter=express() //here i change the route inside views admin folder
adminrouter.set('views','./views/admin')
//controller require
var adminget=require('../controllers/admincontroller')
var productget=require('../controllers/productcontroller')
var categoryget=require('../controllers/categorycontroller')
var orderget=require('../controllers/orderController')
var bannerget=require('../controllers/bannerController')
var couponGet=require('../controllers/couponController')
///middleware
const photoaddmidlware=require('../middleware/photoadd') //middlewaree of photo add
const adminSession=require('../middleware/session')


///admin management controller
adminrouter.get('/admin',adminSession.isAdminSession,adminget.adminlogin)///get admin
adminrouter.post('/signin',adminget.signin) //login admin post

adminrouter.get('/index',nocache(),adminSession.isAdminLogin,adminget.index)//dashboard

adminrouter.get('/users',adminSession.isAdminLogin,adminget.users)//users page render
adminrouter.get('/createuser',adminSession.isAdminLogin,adminget.createuser)//create add user page render
adminrouter.post('/adminuseradd',adminget.adminuseradd)//admin user add post method

adminrouter.get('/edit/:id', adminget.edituser)  //edit user
adminrouter.post('/update/:id',adminget.updateuser)  //update user by admin
adminrouter.get('/deletepage',adminget.deletepage)//delete popup

adminrouter.get('/delete/:id',adminget.deleteuser)//delete users by admin
adminrouter.get('/block',adminget.blockuser) //block user by admin
adminrouter.get('/unblock',adminget.unblockuser) //unblock user by admin
adminrouter.get('/adminlogout',adminget.adminlogout)//admin logout

///product mangement controller
adminrouter.get('/products',adminSession.isAdminLogin,productget.products) //product page by admin
adminrouter.get('/addproductpage',adminSession.isAdminLogin,productget.addproductpage) //product add
adminrouter.post('/productadd',photoaddmidlware.array('productimage'),productget.addproducts)
adminrouter.get('/editProduct/:id',productget.editProductpage)
adminrouter.post('/updateproduct/:id',photoaddmidlware.array('productimage'),productget.updateproduct) 
adminrouter.get('/deleteProduct/:id',productget.deleteProduct)
adminrouter.get('/listProduct',productget.listProduct)
adminrouter.get('/unlistProduct',productget.unlistProduct)

////category mangements controller
adminrouter.get('/category',adminSession.isAdminLogin,categoryget.categorypage) //category page 
adminrouter.post('/categoryadd',categoryget.categoryadd)//category add
adminrouter.get('/categoryEdit/:id',adminSession.isAdminLogin, categoryget.categoryEdit)  //category edit page
adminrouter.post('/categoryUpdate/:id', categoryget.categoryUpdate) //category edit submit button
adminrouter.get('/categoryDelete/:id',categoryget.categoryDelete) ///category delete 
adminrouter.get('/listCategory',categoryget.listcategory) //list category function 
adminrouter.get('/unlistCategory',categoryget.unlistcategory) //unlist category function 

adminrouter.get('/order',adminSession.isAdminLogin,orderget.orderAdminView)
adminrouter.get('/orderProductView/:id',adminSession.isAdminLogin,orderget.orderAdminProductView)

adminrouter.get('/bannerPage',adminSession.isAdminLogin,bannerget.bannerPage)
adminrouter.get('/addBannerGet',adminSession.isAdminLogin,bannerget.addBannerGet)
adminrouter.post('/bannerAdd',photoaddmidlware.single('bannerimage'),bannerget.bannerAdd)

adminrouter.get('/coupenPage',adminSession.isAdminLogin,couponGet.coupenPage)
adminrouter.get('/addCoupenPage',adminSession.isAdminLogin,couponGet.addCoupenPage)
adminrouter.post('/addCoupenPost',couponGet.addCoupenPost)
adminrouter.post('/userTryCouponCode',couponGet.userTryCouponCode)
adminrouter.get('/deleteCoupon/:id',couponGet.deleteCoupon)

adminrouter.get('/salesReport',adminSession.isAdminLogin,orderget.salesReport)
adminrouter.get('/salesReportDailyMonthly',orderget.salesReportDailyMonthly)

// for testing
adminrouter.get('/test',adminget.test)


//module.exports = router;
module.exports= adminrouter
























