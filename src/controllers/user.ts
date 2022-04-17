import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateRegisterInput, validateLoginInput, LoginInputError } from '../utils/validator';
import StatusCodes from "http-status-codes";
import { IUserDocument, User } from '../models/User';

import bcryptjs from "bcryptjs";


// const generateToken=(user:IUserDocument):string=>{
//   return jwt.sign({
//     id:user.id
//   },process.env.JWT_SECRET_KEY!,{expiresIn:'1h'})
// }


const throwLoginValidateError=(errors:LoginInputError)=>{
  throw new HttpException(
    StatusCodes.UNPROCESSABLE_ENTITY,
    "User login input error",
    errors
  );
}

export const postLogin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try {
      const {username,password} =req.body;
      const {errors,valid} =validateLoginInput({username,password});

      if(!valid){
        return throwLoginValidateError(errors);
      }
      const findUser = await User.findOne({ username });
      if (!findUser) {
        errors.general='User not found'
        return throwLoginValidateError(errors);
      };

      const match = await bcryptjs.compare(password, findUser.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return throwLoginValidateError(errors);
    }
      res.json({
        successfull:true,
        data:{
          
        }
      })
   } catch (error) {
     next(error)
   }


}

export const postRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    const { valid, errors } = validateRegisterInput({ username, password, confirmPassword, email });
    if (!valid) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "User register input error",
        errors
      );
    }
    const findUser = await User.findOne({ username });
    if (findUser) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Username  is taken",
        { username: 'The username is taken' }
      );

    }

    const user: IUserDocument = new User({
      username,
      password,
      email
    })

    console.log(User.admin())

    const newUser: IUserDocument = await user.save();
    const token =newUser.generateToken();

    res.json({
      successfull: true,
      data: {
        user: newUser._doc,
        token
      }
    })


  } catch (error) {
    next(error);
  }
}