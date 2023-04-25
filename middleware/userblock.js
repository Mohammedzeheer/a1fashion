const usercollection = require("../models/usermodel");
//const user=require("../models/usermodel")
// var msg="You are blocked"

const blockUser=async(req,res,next)=>{
    try {     
      const userData= await usercollection.findOne({email:req.body.email})
      if(userData.blocked==true){   
        // msg= "You are blocked"  
        res.render('userlogin',{msg:"You are blocked",user:true})
      }else{
        next();
      }
    } catch (error) {
        console.log(error);        
    }}
    
    module.exports={blockUser}