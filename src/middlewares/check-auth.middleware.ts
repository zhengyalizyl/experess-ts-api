import { NextFunction,Response,Request } from "express";
import StatusCodes from "http-status-codes";
import HttpException from "../exception/HttpException";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JwtPayload } from '../types/jwt';


export const checkAuthMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers["authorization"];
    if (authorizationHeader) {
        const token = authorizationHeader.split('Bearer ')[1];
        if (token) {
            try {
                const jwtData = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload
                const user = await User.findById(jwtData.id);
                if (user) {
                 //这里需要存储用户并将用户存储在req中
                 req.currentUser=user
                 return next()
                } else {
                    return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Not such user'));
                }
        } catch (error) {
            return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid/Expired token'));
        }
    }

        return next(new HttpException(StatusCodes.UNAUTHORIZED, "Authorization token must be 'Bearer [token]"));

    }
    console.log(req.header, res)
    next(new HttpException(StatusCodes.UNAUTHORIZED, 'Authorization header must be provided'));
}