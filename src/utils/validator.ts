import { IUserDocument } from 'src/models/User';
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import equals  from "validator/lib/equals";

interface RegisterInputError extends  Partial<IUserDocument>{
    confirmPassword?:string
}


export interface LoginInputError extends  Partial<IUserDocument>{
  general?:string
}

interface registerType{
     username:IUserDocument["username"],
     password:IUserDocument["password"],
     email:IUserDocument["email"],
     confirmPassword:IUserDocument["password"]
}
  


export const validateRegisterInput=({username,password,email,confirmPassword}:registerType)=>{
     let errors:RegisterInputError={};
     if (isEmpty(username||'')) {
        errors.username = "Username must not be empty";
      }
    
      if (isEmpty(password||'')) {
        errors.password = "Password must not be empty";
      }
    
      if (isEmpty(confirmPassword||'')) {
        errors.confirmPassword = "Confirmed password must not be empty";
      }
    
      if (!equals(password||'', confirmPassword||'')) {
        errors.confirmPassword = "Passwords must match";
      }
    
      if (isEmpty(email||'')) {
        errors.email = "Email must not be empty";
      }
    
      if (!isEmail(email||'')) {
        errors.email = "Email must be a valid email address";
      }
    return {errors,valid:Object.keys(errors).length<1}
}


interface loginType{
  username:IUserDocument["username"],
  password:IUserDocument["password"],
}


export const validateLoginInput=({username,password}:loginType)=>{
  let errors:LoginInputError={};
  if (isEmpty(username||'')) {
     errors.username = "Username must not be empty";
   }
 
   if (isEmpty(password||'')) {
     errors.password = "Password must not be empty";
   }
 
 return {errors,valid:Object.keys(errors).length<1}
}