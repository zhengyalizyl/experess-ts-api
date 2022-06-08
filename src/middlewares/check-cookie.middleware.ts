import { NextFunction,Response,Request } from "express";
import StatusCodes from "http-status-codes";
import HttpException from "../exception/HttpException";

import Admin from "../models/Admin";

export const checkAdminCookieMiddleware=async(req:Request,_res:Response,next:NextFunction)=>{
    const userId=req.signedCookies['userId'];
    if (userId) {
        try {
            const admin = await Admin.findById(userId);
            if (admin) {
                //这里需要存储管理员并将管理员信息存储在req中
                req.currentAdmin=admin
                return next()
               } else {
                   return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Not such admin'));
               }
            
        } catch (error) {
            return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid/Expired cookie'));
        }
             
    }
    next(new HttpException(StatusCodes.UNAUTHORIZED, 'cookie must be provided'));
    
}