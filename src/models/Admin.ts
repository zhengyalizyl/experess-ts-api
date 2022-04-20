import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { AdminJwtPayload } from "../types/jwt";
import {auth} from "../config/config";
import uniqueValidator  from 'mongoose-unique-validator';
export interface IAdminDocument extends Document {
  username: string;
  password: string;
  generateToken: () => string;
  _doc:IAdminDocument;
}

const adminSchema: Schema = new Schema(
  {
    username: {type:String,unique:true,trim:true},
    password: String
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

adminSchema.plugin(uniqueValidator)
const Admin: Model<IAdminDocument> = model<IAdminDocument>(
  "Admin",
  adminSchema
);

export default Admin;
