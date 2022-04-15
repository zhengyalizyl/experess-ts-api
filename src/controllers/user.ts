import { NextFunction,Response,Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateRegister } from '../utils/validator';
import StatusCodes from "http-status-codes";
import { IUserDocument, User } from '../models/User';
import bcryptjs from "bcryptjs";


export const postRegister=async (req:Request,res:Response,next:NextFunction)=>{
    try{
   const {username,password,confirmPassword,email}=req.body;
    const {valid,errors}  = validateRegister({username,password,confirmPassword,email});
    if (!valid) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "User register input error",
          errors
        );
      }
      const findUser=await User.findOne({username});
      if(findUser){
          throw new HttpException(
              StatusCodes.UNPROCESSABLE_ENTITY,
              "Username  is taken",
              {username:'The username is taken'}
          );
          
      }

      const user:IUserDocument=new User({
          username,
          password,
          email
      })

   const newUser:IUserDocument=  await user.save();

     res.json({
         successfull:true,
         data:{
            user:newUser._doc 
         }
     })


    } catch (error) {
      next(error);
    }
}