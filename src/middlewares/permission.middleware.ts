import { Request,Response,NextFunction  } from "express";
import StatusCodes from "http-status-codes";
import HttpException from "../exception/HttpException";


  export const  permit=(req:Request,_res:Response,next:NextFunction)=>{
      if(req.currentAdmin!.username==='zyl'){
          next()
      }else{
          next(new HttpException(StatusCodes.FORBIDDEN,"access denied"))
      }
  }