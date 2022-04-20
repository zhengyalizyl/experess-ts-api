import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateAdminRegisterInput, validateAdminLoginInput, AdminLoginInputError } from '../utils/validator';
import StatusCodes from "http-status-codes";
import Admin,{ IAdminDocument } from '../models/Admin';
import bcryptjs from "bcryptjs";

export const adminRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const { username, password,confirmPassword } = req.body;
      const { valid, errors } = validateAdminRegisterInput({ username, password,confirmPassword});
      if (!valid) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "User register input error",
          errors
        );
      }
      const findUser = await Admin.findOne({ username });
      if (findUser) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "Username  is taken",
          { username: 'The username is taken' }
        );
  
      }
  
    const hashPassword =await bcryptjs.hash(password,10);

      const admin: IAdminDocument = new Admin({
        username,
        password:hashPassword
      })
  
      
  
      const newAdmin: IAdminDocument = await admin.save();
      const token =newAdmin.generateToken();
  
      res.json({
        successfull: true,
        data: {
          // user: newAdmin._doc,
          token
        }
      })
  
    } catch (error) {
      next(error);
    }
  }


  const throwLoginValidateError=(errors:AdminLoginInputError)=>{
    throw new HttpException(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Admin login input error",
      errors
    );
  }

  export const postAdminLogin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
       const {username,password} =req.body;
       const {errors,valid} =validateAdminLoginInput({username,password});
 
       if(!valid){
         return throwLoginValidateError(errors);
       }
       const findUser = await Admin.findOne({ username });
       if (!findUser) {
         errors.general='admin User not found'
         return throwLoginValidateError(errors);
       };
 
       const match = await bcryptjs.compare(password, findUser.password);
 
     if (!match) {
       errors.general = "Wrong credentials";
       return throwLoginValidateError(errors);
     }
     const token =findUser.generateToken();
       res.json({
         successfull:true,
         data:{
           token
         }
       })
    } catch (error) {
      next(error)
    }
 
 }


 export const adminList=async (_req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
    const  admins=await Admin.find();
     res.json({
       successfull:true,
       data:{
         admins
       }
     })
  } catch (error) {
    next(error)
  }

}


export const addAdmin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
   
    const {username,password} =req.body;
    const {errors,valid} =validateAdminLoginInput({username,password});

    if(!valid){
      return throwLoginValidateError(errors);
    }

    const findUser = await Admin.findOne({ username });
      if (findUser) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "Username  is taken",
          { username: 'The username is taken' }
        );
  
      }

    const hashedPassword=await bcryptjs.hash(password,10);
    const admin=new Admin({
      username,
      password:hashedPassword
    })
    const resAdmin=await admin.save()

     res.json({
       successfull:true,
       data:{
         admin:resAdmin
       }
     })
  } catch (error) {
    next(error)
  }

}