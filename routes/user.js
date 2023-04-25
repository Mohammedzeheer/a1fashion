var express = require('express');
var userrouter = express()
userrouter.set('views','./views/user')
var userget=require('../controllers/usercontroller')
var cartGet=require('../controllers/cartController')
var wishlistGet=require('../controllers/wishlistController')
var addressGet=require('../controllers/AddressController')
var orderGet=require('../controllers/orderController')
var blockUser=require('../middleware/userblock')
var usersession=require('../middleware/session')
const nocache = require("nocache");


userrouter.get('/',nocache(),userget.indexpage);
// router.get('/shop',userget.shoppage );
userrouter.get('/shop',usersession.isLogin,userget.productshowuser ); //shop page 

userrouter.get('/about',userget.aboutpage);
userrouter.get('/contact',userget.contactPage);
userrouter.get('/blog',userget.blogPage);


userrouter.get('/shop-details',userget.shopdetails) //shop details page 

userrouter.get('/shoppingCart',usersession.isLogin,cartGet.userGetShopCart) //HERE SHOP PAGE WILL APPEAR
userrouter.get('/addToCart',cartGet.addToCart) //ADD TO CART FUNCTION HERE WORKS
userrouter.get('/deleteCart',cartGet.deleteFromcart)//DELETE FROM CART 
userrouter.put('/updateQuantity/:id',cartGet.updateQuantity)


userrouter.get('/addToWishlist',wishlistGet.addToWishlist); //here add to wishlist works 
userrouter.get('/wishlist',usersession.isLogin,wishlistGet.GetWishlist); //here show wishlist page 
userrouter.get('/deletewishlist/:id',wishlistGet.deleteFromWishlist) //delete condition work here 

userrouter.get('/checkout',addressGet.checkoutPage)// CHECKOUT PAGE 
// userrouter.get('/ordered',addressGet.ordered)//success page 
userrouter.post('/ordered',orderGet.userPostOrderListPass)
userrouter.post('/verify-payment',orderGet.userGetverifypayment)
userrouter.get('/orderUser',orderGet.orderUserPage)
userrouter.get('/orderProductView',orderGet.orderProductView)
userrouter.get('/orderSuccessfully',orderGet.orderSuccessfully)

userrouter.get('/addtoreturn/:id/:grandtotal',userget.addToReturn)

userrouter.get('/cancelOrderAdmin/:id/:grandtotal',userget.cancelOrderByAdmin)
userrouter.get('/returnConfirm/:id/:grandtotal',userget.returnConfirm)

userrouter.get('/cancelOrder/:id/:grandtotal',userget.cancelOrder)

userrouter.get('/confirmOrder/:id',userget.confirmOrder)
userrouter.get('/makeDeliveredByAdmin/:id',userget.makeDeliveredByAdmin)

userrouter.get('/login',userget.loginpage)  //LOGIN PAGE OF USER
userrouter.get('/signupPage',userget.signupPage)//SIGNUP page render

//// userrouter.post('/userlogin',nocache(),blockUser.blockUser,userget.userlogin);
userrouter.post('/userlogin',nocache(),userget.userlogin)
userrouter.post('/register',userget.usersignup); //RIGISTER PAGE
userrouter.get('/userlogout',userget.logout)    

userrouter.get('/categoryFilter',userget.categoryFilter)  //HERE PATTERN CATTEGORY 

userrouter.get('/otp',userget.otppage)
userrouter.post('/otpsubmit',userget.otpsubmit)
userrouter.get('/resendotp',userget.resendotp)

userrouter.get('/testing',userget.fortesting); //here show wishlist page 

userrouter.get('/userprofile',addressGet.userprofile); //here show userprofile page 
userrouter.post('/userAddress',addressGet.userAddress); //here post the address details 
userrouter.get('/groupAddress',addressGet.groupAddress);
userrouter.get('/selectAddress/:indexof',addressGet.selectAddress)

userrouter.post('/welcomeMessage',userget.welcomeMessageUser)



module.exports = userrouter;
