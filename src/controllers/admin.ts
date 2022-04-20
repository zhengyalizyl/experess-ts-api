import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateRegisterInput} from '../utils/validator';
import StatusCodes from "http-status-codes";
import Admin,{ IAdminDocument } from '../models/Admin';
import bcryptjs from "bcryptjs";

export const adminRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
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
          user: newAdmin._doc,
          token
        }
      })
  
    } catch (error) {
      next(error);
    }
  }