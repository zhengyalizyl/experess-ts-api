import { Request,Response,NextFunction  } from "express";
import StatusCodes from "http-status-codes";
import HttpException from "../exception/HttpException";


  export const  permit=(...allowed:Array<string>)=>{
    const isAllowed=(role:string)=>allowed.indexOf(role)>-1;
      return (req:Request,_res:Response,next:NextFunction)=>{
        if(req.currentAdmin&&(req.currentAdmin.isAdmin||isAllowed(req.currentAdmin.role))){
            next()
        }else{
            next(new HttpException(StatusCodes.FORBIDDEN,"access denied"))
        }
    }
  }