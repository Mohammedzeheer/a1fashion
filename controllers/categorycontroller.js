const usercollection=require('../models/usermodel')
const admincollection=require('../models/adminmodel')
const productcollection=require('../models/productmodel')
const categorycollection=require('../models/categorymodel')



  // /// <<<<<<<<<<<<< CATEGORY TABLE PAGE  >>>>>>>>>>>>>>>>>>>
  const categorypage=async function(req, res, next) {
    try {
      let categorytable= await categorycollection.find().lean()    
      res.render('category',{categorytable,admin:true,catmsg,category:true});
      catmsg=null;
    } catch (error) {
      console.log(error)
      res.render('404')
    }
    }

 

   ///// <<<<<<<<<<<<< CATEGORY ADD NEW   >>>>>>>>>>>>>>>>>>>
   var catmsg
   const categoryadd =async function(req,res,next){
    try {
      const checkCategoryExist= await categorycollection.findOne({categoryname:req.body.categoryname}) 

      if(checkCategoryExist)
      {
        catmsg="category arleady exist"
        res.redirect('/category')       
       }
       else{
         await categorycollection.insertMany({categoryname:req.body.categoryname}) 
         res.redirect('/category')
       } 
    } catch (error) {
      console.log(error)
      res.render('404')
    }
   }  
 
   

    //// <<<<<<<<<<<<< CATEGORY DELETE CODE   >>>>>>>>>>>>>>>>>>>
    const categoryDelete= function(req,res){
      try {
        let catdlt=req.params.id
        async function deletecategory(){
           await categorycollection.deleteOne({_id:catdlt})    
           res.redirect('/category'); 
         }
         deletecategory(); 
      } catch (error) {
        console.log(error)
        res.render('404')
      } 
    }


   ///// <<<<<<<<<<<<< CATEGORY EDIT PAGE >>>>>>>>>>>>>>>>>>>
   const categoryEdit = async function(req,res,next){
    try {
      let id=req.params.id     
      const cE=await categorycollection.findOne({_id:id})    
      res.render('categoryEdit',{id:cE._id,categoryname:cE.categoryname,admin:true}); 
    } catch (error) {
      console.log(error)
      res.render('404')
    }
}

  ///// <<<<<<<<<<<<< CATEGORY UPDATE  >>>>>>>>>>>>>>>>>>>
  const categoryUpdate= async (req,res,next)=>{
    try {
      var catupdateid=req.params.id
      const checkCategoryExist= await categorycollection.findOne({categoryname:req.body.categoryname}) 
      if(checkCategoryExist)
      {
        catmsg="category arleady exist"
        res.redirect('/category')       
       }
       else{
        await categorycollection.updateOne({_id:catupdateid},{$set:{
          categoryname:req.body.categoryname, 
        }}).then(()=>{res.redirect('/category')})
       }
    } catch (error) {
      console.log(error)
        res.render('404')
    }   
  }


    /// <<<<<<<<<<<<< LIST CATEGORY BY ADMIN  >>>>>>>>>>>>>>>>>>>
    const listcategory=async(req,res)=>{
        try {        
          const categoryData= await categorycollection.findOne({_id:req.query.id})
         if(categoryData){
          await categorycollection.updateOne({_id:categoryData.id},{$set:{status:true}})
          await productcollection.update({productcategory:categoryData.categoryname},{$set:{categorystatus:true}})
           res.redirect('/category')
         }
        } catch (error) {
          console.log(error)
          res.render('404')    
        }}

      
      ////// <<<<<<<<<<<<< UN BLOCK USER BY ADMIN >>>>>>>>>>>>>>>>>>>
      const unlistcategory=async(req,res)=>{
        try {        
          const categoryData= await categorycollection.findOne({_id:req.query.id})
         if(categoryData){
          await categorycollection.updateOne({_id:categoryData.id},{$set:{status:false}})
          await productcollection.update({productcategory:categoryData.categoryname},{$set:{categorystatus:false}})
           res.redirect('/category')
         }
        } catch (error) {
          console.log(error)
        res.render('404')      
        }}
        

        //module exports
  module.exports={
    categorypage,
    categoryadd,categoryDelete,categoryEdit,categoryUpdate,
    listcategory,unlistcategory,

  }







 