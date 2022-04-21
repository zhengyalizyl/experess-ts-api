import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { AdminJwtPayload } from "../types/jwt";
import {auth} from "../config/config";
import uniqueValidator  from 'mongoose-unique-validator';
//@ts-ignore
import mongooseExists from "mongoose-exists";
import { IRoleDocument } from './Role';

// export enum Role{
//   admin="admin",
//   basic ="basic",
//   coder="coder"
// }
export interface IAdminDocument extends Document {
  username: string;
  password: string;
  generateToken: () => string;
  _doc:IAdminDocument;
  // role:Role;
  role:IRoleDocument["_id"];
  roles:IRoleDocument["_id"][];
  isAdmin:boolean;
}

const adminSchema: Schema = new Schema(
  {
    username: {type:String,unique:true,trim:true},
    password: String,
    isAdmin:{type:Boolean,default:false},
    // role:{type:String,default:'basic'}
    role:{
      type:Schema.Types.ObjectId,
      ref:"Role",
      exist:true,
      autopopulate:true//自动填充role的相关信息比如nane，nameCn到这里来
    },
    roles:[{
      type:Schema.Types.ObjectId,
      ref:"Role",
      exist:true,
      autopopulate:true//自动填充role的相关信息比如nane，nameCn到这里来
    }]
  },
  { timestamps: true }
);

adminSchema.methods.generateToken = function(): string {
  const payload: AdminJwtPayload = { id: this.id };
  return jwt.sign(payload, auth.adminSecretKey, {
    expiresIn: "5d"
  });
};

adminSchema.set("toJSON", {
  transform: function(_doc, ret) {
    delete ret["password"];
    return ret;
  }
});

adminSchema.plugin(mongooseExists)
adminSchema.plugin(uniqueValidator)
adminSchema.plugin(require('mongoose-autopopulate'))


const Admin: Model<IAdminDocument> = model<IAdminDocument>(
  "Admin",
  adminSchema
);

export default Admin;
