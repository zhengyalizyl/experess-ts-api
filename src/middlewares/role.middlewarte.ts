import { Request,Response,NextFunction  } from "express";
import StatusCodes from "http-status-codes";
import { IPermissionDocument } from "../models/Permission";
import HttpException from "../exception/HttpException";


  export const  allowRole= (allowed: string) => {
    const isAllowed = (permissions: string[]) =>
      permissions.indexOf(allowed) > -1;
  
    return (req: Request, _res: Response, next: NextFunction) => {
      if (req.currentAdmin!.isAdmin) {
        return next();
      }
  
      const role = req.currentAdmin!.role;
  
      if (!role) {
        return next(new HttpException(StatusCodes.FORBIDDEN, "Access Denied"));
      }
  
      if (
        isAllowed(
          role.permissions.map(
            (permission: IPermissionDocument) => permission.name
          )
        )
      ) {
        next();
      } else {
        next(new HttpException(StatusCodes.FORBIDDEN, "Access Denied"));
      }
    };
  };