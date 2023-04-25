// onkeyup="return userProfileValiddation()" onsubmit="return userProfileValiddation()"
function userProfileValiddation(){
    var name=document.Submission.name.value;  
    var phonenumber=document.Submission.phonenumber.value;
    var email=document.Submission.email.value;
    var phonenumber=document.Submission.phonenumber.value;
    var address=document.Submission.address.value;
    var country=document.Submission.country.value;  
    
    var state=document.Submission.state.value;
    var district=document.Submission.district.value;  

    
    var capitalregex1=/^[A-Z][a-z0-9_-]{3,30}$/
    var capitalregex=/^[A-Z]+[a-zA-Z]*$/

    var emailregex=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/gm;
    var phoneregex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    
   var err=document.getElementById("erorr");
    

    // <<<<<<<<<<<<<<<<-- NAME -->>>>>>>>>>>
   if(name.length==0){
       err.innerHTML='Name is Empty'      
       return false;
    }
    if(!name.match(/^[A-Za-z]/)) {
     err.innerHTML='Invalid Name'  
     return false;
     }
    if(name.length<5){
    err.innerHTML='Name must be at least 5 characters';
        return false;
    }

 
  
   // <<<<<<<<<<<<<<<<--EMAIL -->>>>>>>>>>>
    if(email=="")
    {
    err.innerHTML='Email is Empty';
        return false;
    }  
    if(emailregex.test(email)==false){
    err.innerHTML='Invalid Email'
    return false
    }
 
      // <<<<<<<<<<<<<<<<--PHONE NUMBER -->>>>>>>>>>>
      if(phonenumber=="")
      {
      err.innerHTML='Phone number is Empty';
          return false;
      } 
      if(phoneregex.test(phonenumber)==false){
      err.innerHTML='Invalid Phone Number'
      return false
      }
   
   // <<<<<<<<<<<<<<<<--ADDRESS -->>>>>>>>>>>
    if(address.length==0){
        err.innerHTML='The Address is Empty'      
        return false;
     }
    
     if(address.length<7){
     err.innerHTML='Enter Full address';
         return false;
     }
 

     // <<<<<<<<<<<<<<<<--Country-->>>>>>>>>>>
    if(country.length==0){
        err.innerHTML='The Country is Empty'      
        return false;
     }
    
 
     if(capitalregex.test(country)==false){
        err.innerHTML='Country First letter must be capital'
        return false
        }
    
        
     // <<<<<<<<<<<<<<<<--STATE-->>>>>>>>>>>
     if(state.length==0){
        err.innerHTML='The State field is Empty'      
        return false;
     }
    
     if(capitalregex.test(state)==false){
        err.innerHTML='State First letter must be capital'
        return false
        }


    // <<<<<<<<<<<<<<<<--STATE-->>>>>>>>>>>
     if(district.length==0){
        err.innerHTML='The District field is Empty'      
        return false;
     }
    
     if(capitalregex.test(district)==false){
        err.innerHTML='District First letter must be capital'
        return false
        }
        

        /^ [0-9]{1,6}$ /  
 return true;
 }