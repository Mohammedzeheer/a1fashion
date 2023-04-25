function validateform(){
   var name=document.Submission.name.value;  
   var phonenumber=document.Submission.phonenumber.value;
   var email=document.Submission.email.value;
   var password=document.Submission.password.value;  
   var regex=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/gm;
   var phoneregex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
   
  var err=document.getElementById("erorr");
   
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
//    if(name.match(/\ /)) {
//        err.innerHTML='Spaces not allowed'  
//    return false;
//    }

   if(phonenumber=="")
   {
   err.innerHTML='Phone number is Empty';
       return false;
   } 
   if(phoneregex.test(phonenumber)==false){
   err.innerHTML='Invalid Phone Number'
   return false
   }

   if(email=="")
   {
   err.innerHTML='Email is Empty';
       return false;
   }  
   if(regex.test(email)==false){
   err.innerHTML='Invalid Email'
   return false
   }

      if(password=="")
       {
       err.innerHTML='password is Empty';
           return false;
       } 

       if (password.length < 6) {
           err.innerHTML='Your password must be at least 6 characters'
           return false
       }
       if (password.search(/[a-z]/i) < 0) {
           err.innerHTML='Your password must contain at least one letter'
           return false
       }
       if (password.search(/[0-9]/) < 0) {
           err.innerHTML='Your password must contain at least one digit'
           return false
       }

           
return true;
}