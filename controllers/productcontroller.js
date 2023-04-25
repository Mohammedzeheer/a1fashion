const usercollection=require('../models/usermodel')
const admincollection=require('../models/adminmodel')
const productcollection=require('../models/productmodel')
const categorycollection=require('../models/categorymodel')
const multer  = require('multer')
const {v4:uuidv4} = require('uuid'); //here i adde uuid for product id 


///show products table 
const products= function(req,res,next){
  try {
    async function findProductData(){
      let producttable= await productcollection.find().lean()    
       res.render('products',{producttable,admin:true}); 
     }  
     findProductData();
  } catch (error) {
    next()
  }
}
  

      //show add productpage 
      const addproductpage = async function (req, res, next) {
        try {
          let categorydropdown = await categorycollection.find().lean()
          res.render('addproduct', { categorydropdown, admin: true })
        } catch (error) {
          next()
        }
      }

     

        ///add products to table
        const addproducts=async(req,res)=>{
          try {
            const length=req.files.length
            let image=[]
            for(let i=0;i<length;i++){
             image[i]=req.files[i].filename
            }
              const productscol=await new productcollection({
                   productname:req.body.productname,
                   productid:uuidv4(),
                   productprice:req.body.productprice,
                   productcategory:req.body.productcategory,
                   productbrand:req.body.productbrand,                 
                   productimage:image,
                   stock:req.body.stock,
                   date:new Date().toLocaleString(), 
                   description:req.body.description,
                                   
              })                      
              const productData= await productscol.save();            
             if(productData)
             { res.redirect('/products') }     
             else
             {res.redirect("/addproduct") }  
          } catch (error) { console.log(error);}}
    

          
      //edit product page
        const editProductpage=async function(req,res,next){
          try {
            let producteditid=req.params.id     
            let categorydropdown= await categorycollection.find().lean() 
            const editproductdata=await productcollection.findOne({_id:producteditid}).lean()  
         res.render('editproduct',{id:editproductdata._id,editproductdata,categorydropdown,admin:true}); 
       
          } catch (error) {
            next()
          }
       }


        
const  updateproduct=async function (req,res,next){
const updateproductid=req.params.id
  try {
    const length=req.files.length
    let image=[]
    for(let i=0;i<length;i++){
    image[i]=req.files[i].filename
    }
await productcollection.updateOne({_id:updateproductid},{$set:{
               productname:req.body.productname,
              //  productid:uuidv4(),
               productprice:req.body.productprice,
               productcategory:req.body.productcategory,
               productbrand:req.body.productbrand,                 
               productimage:image,
               stock:req.body.stock,
              //  date:new Date().toLocaleString(), 
              description:req.body.description  
}}).then(()=>{res.redirect('/products')})
}catch(error){
console.log(error);
}}


   //DELETE PRODUCT FUNCTION
  const deleteProduct= function(req,res){
    try {
      let dltprod=req.params.id
      async function deleteproductdata(){
         await productcollection.deleteOne({_id:dltprod})    
         res.redirect('/products'); 
       }
       deleteproductdata();  
    } catch (error) {
      next()
    }
  }


      ///LIST product BY ADMIN 
      const listProduct=async(req,res)=>{
        try {        
          const productdata= await productcollection.findOne({_id:req.query.id})
         if(productdata){
          await productcollection.updateOne({_id:productdata.id},{$set:{status:true}})
           res.redirect('/products')
         }
        } catch (error) {
            console.log(error);        
        }}

      
      /// UN BLOCK product BY ADMIN 
      const unlistProduct=async(req,res)=>{
        try {        
          const productdata= await productcollection.findOne({_id:req.query.id})
         if(productdata){
          await productcollection.updateOne({_id:productdata.id},{$set:{status:false}})
           res.redirect('/products')
         }
        } catch (error) {
            console.log(error);        
        }}

  


  module.exports={products,
    addproducts,addproductpage,
    editProductpage,updateproduct,
    deleteProduct,
    listProduct,unlistProduct
   }