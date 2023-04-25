function productvalidateform(){
    var productname=document.proSubmission.productname.value;  
    var stock=document.proSubmission.stock.value;
    var productbrand=document.proSubmission.productbrand.value;
    var productprice=document.proSubmission.productprice.value; 

    var productcategory=document.proSubmission.productcategory.value;
    var description=document.proSubmission.productname.value;  
    var productimage=document.proSubmission.stock.value;
    numberregex=/^[0-9]*$/
    
   var err=document.getElementById("ProductErorr");

    
   if(productname.length==0){
       err.innerHTML='The Product Name is Empty'      
       return false;
    }
    if(!productname.match(/^[A-Za-z]/)) {
     err.innerHTML='Invalid Product Name'  
     return false;
     }

    if(productname.length<3){
    err.innerHTML='Name must be at least 3 characters';
        return false;
    }
 
    if(numberregex.test(stock)==false)
    {
    err.innerHTML='Stock must be number';
        return false;
    } 

    if(numberregex.test(productprice)==false){
    err.innerHTML='Price must be Number'
    return false
    }

    if(productcategory.length==0){
        err.innerHTML='Select category'      
        return false;
     }
    
            
 return true;
 }