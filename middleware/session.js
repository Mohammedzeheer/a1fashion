const session=require('express-session')

const usersession= async (req,res,next)=>{
    try
    {
        if(req.session.user)
          next()
        else{
            res.redirect('/')
        }
    }  
    catch(error){
        console.log(error);
    }
}

//login session
const isLogin= async(req,res,next)=>{
    try {
        if(req.session.user){}
        else{
            // msg="Please login to shop"
            res.redirect('/login')
        }
        next()
        
    } catch (error) {
        console.log(error.message);   
    }
}

//login session
const isLogout= async(req,res,next)=>{
    try {
        if(req.session.user){
         res.redirect('/userhome')
        } 
        next();      
              
    } catch (error) {
        console.log(error);   
    }
 }


 const isAdminLogin=async (req,res,next)=>{
     if(req.session.admin==null) {
        res.render('admin',{adminlogin:true}); 
       }
     else{
        next()
     }  
 }

 const isAdminSession=async (req,res,next)=>{
    if(req.session.admin) {
        res.redirect('/index')      
      }
    else{
        res.render('admin',{adminlogin:true}); 
    }  
}



module.exports={isLogin,isLogout,usersession,isAdminLogin,isAdminSession}