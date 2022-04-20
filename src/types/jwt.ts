import { IUserDocument } from "../models/User";
import { IAdminDocument } from '../models/Admin';

export interface JwtPayload {
  id: IUserDocument["_id"];
}


export interface  AdminJwtPayload{
  id:IAdminDocument["_id"]
}