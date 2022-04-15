import { NextFunction,Request,Response } from 'express';
import HttpException from '../exception/HttpException';
import StatusCodes from "http-status-codes";


export const errorMiddleware=(err:HttpException,_req:Request,res:Response,next:NextFunction)=>{
     const  status=err.status||StatusCodes.INTERNAL_SERVER_ERROR;
     const message= err.message||'Something went wrong'
      res.status(status).json(
          {
            success:"false",
            message,
            errors:err.errors
          }
      )
      next();

}