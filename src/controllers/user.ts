import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateRegister } from '../utils/validator';
import StatusCodes from "http-status-codes";
import { IUserDocument, User } from '../models/User';
import jwt from "jsonwebtoken";
// import bcryptjs from "bcryptjs";


export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    const { valid, errors } = validateRegister({ username, password, confirmPassword, email });
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

    const newUser: IUserDocument = await user.save();
    const token = jwt.sign({
      id: newUser.id
    }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1h'
    })

    res.json({
      successfull: true,
      data: {
        // user: newUser._doc,
        token
      }
    })


  } catch (error) {
    next(error);
  }
}