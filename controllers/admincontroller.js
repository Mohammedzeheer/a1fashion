var session=require('express-session')
const usercollection=require('../models/usermodel')
const admincollection=require('../models/adminmodel')
const productcollection=require('../models/productmodel')
const categorycollection=require('../models/categorymodel')
const ordercollection=require('../models/orderModel')
const middleware=require('../middleware/userblock')
const multer  = require('multer')
let invalida 
let msg


   ///ADMIN LOGIN RENDER -------------------
  const adminlogin=function(req, res, next) {
    try {
      res.render('admin',{invalida,adminlogin:true}); 
    invalida=null; 
    } catch (error) {
     res.render('404') 
    }   
  }


    ///HOME PAGE  ADMIN OR DASHBOARD PAGE RENDER HERE 
    const index=async function (req,res,next){
      try {
        admin=req.session.admin
        const userCount=await usercollection.find().count()
        const blockedUser=await usercollection.find({blocked:true}).count()

        const orderedCount= await ordercollection.findOne({status:"Delivered"}).count()
        const shippedCount= await ordercollection.findOne({status:"Shipped"}).count()
        const revenue=await ordercollection.aggregate([{$match:{status:"Delivered"}},{$group:{_id:null,sum:{$sum:"$grandtotal"}}},{$project:{_id:0}}])
        totalRevenue=revenue[0].sum
        res.render('index',{userCount,blockedUser,orderedCount,totalRevenue,shippedCount,admin:true})
      } catch (error) {
        next()
      }
    }


    //USER MANAGEMENT  table
    const users= async function(req, res, next) {
      try {
        let totable= await usercollection.find().lean() 
        res.render('users',{totable,admin:true}); 
      } catch (error) {
        next()
      }
      }


      //SIGIN POST METHOD 
     var admin="zeheer"
   const signin=(req,res,next)=>{
    try {
      async function checkingadmin(){   
        let admindata ={
          adminname:req.body.adminname,
          adminpassword:req.body.adminpassword
        }
    const adminfind= await admincollection.findOne({adminname:admindata.adminname})
      if(adminfind==null){    
         invalida="Invalid Name"
         res.redirect('/admin')  
         }else if(adminfind.adminpassword==admindata.adminpassword){    
          req.session.admin=adminfind.adminname      
           res.redirect('/index')
         }  
         else if(adminfind.adminpassword!=admindata.adminpassword)
         {
            res.redirect('/admin')
            invalida="Invalid Password"
         }
  }
  checkingadmin()
    } catch (error) {
      
    }

    }
    

      const createuser=(req,res,next)=>{
        try {
          res.render('create',{msg})
        msg=null;
        } catch (error) {
          res.render('404')
        }    
      }

   

    //ADMIN USER ADD THIS FUNCTION NOT USED 
    const adminuseradd=(req,res,next)=>{
      try {
        let data={
          name:req.body.name,
          phonenumber:req.body.phonenumber,
          email:req.body.email,
          password:req.body.password
       }   
     async function userexist(){
      const user1=await usercollection.findOne({email:data.email})  
       if(user1){  
          msg="Account Already Exist"   
          res.redirect('/createuser')
       } else{
         usercollection.insertMany([data])   
          res.redirect('/users')
       } 
     }
     userexist()
      } catch (error) {
        res.render('404')
      }    
      }
    

       // EDIT USER BY ADMIN  PAGE 
    const edituser=  async function(req,res,next){
      try {
        let id=req.params.id     
        const editc=await usercollection.findOne({_id:id})    
        res.render('edit',{id:editc._id,name:editc.name,phonenumber:editc.phonenumber,email:editc.email,password:editc.password,blocked:editc.blocked}); 
      } catch (error) {
        res.render('404')
      }
      }
    

      // USER ADMIN UPDATE THE USER DATAS 
     const updateuser= async (req,res,next)=>{
      try {
        var updateid=req.params.id
        await usercollection.updateOne({_id:updateid},{$set:{
         name:req.body.name,
         phonenumber:req.body.phonenumber,
       }}).then(()=>{res.redirect('/users')})
      } catch (error) {
        console.log(error)
      }    
    }


       
    const deletepage=function(req, res, next) {
      try {
        res.render('delete'); 
      } catch (error) {
        console.log(error)
      }
    };
       
    //DELETE USER FUNCTION 
    const deleteuser= async function(req,res,next){
      try {
        let dlt=req.params.id
           await usercollection.deleteOne({_id:dlt})    
           res.redirect('/users'); 
      } catch (error) {
        console.log(error)
        next()
      } 
      }


      //ADMIN LOGOUT 
      const adminlogout=function(req, res, next) {  
        try {
          req.session.admin="" 
          req.session=null  

        res.render('admin',{adminlogin:true}); 
        // res.redirect('/admin'); 
        } catch (error) {
          console.log(error)
          next()
        }      
      };


       //// TESTING 
      const test=function(req, res, next) {
        res.render('test',{admin:true}); 
      };


      
      ///BLOCKING USER BY ADMIN  
      const blockuser=async(req,res,next)=>{
        try {        
          const userData= await usercollection.findOne({_id:req.query.id})
         if(userData){
          await usercollection.updateOne({_id:userData.id},{$set:{blocked:true}})
           res.redirect('/users')
         }
        } catch (error) {
            console.log(error);    
            next()    
        }}

      

      /// UN BLOCKIN USER BY ADMIN
      const unblockuser=async(req,res,next)=>{
        try {        
          const userData= await usercollection.findOne({_id:req.query.id})
         if(userData){
          await usercollection.updateOne({_id:userData.id},{$set:{blocked:false}})
           res.redirect('/users')
         }
        } catch (error) {
            console.log(error);   
            next()     
        }}


  
  module.exports={
    adminlogin,users,signin,createuser,
    adminuseradd,edituser,updateuser,deleteuser,
    adminlogout,index,deletepage,test,blockuser,unblockuser,  
  }