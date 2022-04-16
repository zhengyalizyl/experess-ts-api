import bcryptjs  from 'bcryptjs';
// import isEmail from 'validator/lib/isEmail';
import mongoose, { Model, Schema, Document,CallbackWithoutResultAndOptionalError } from "mongoose";
import {v4} from 'uuid';

enum Role{
    basic='basic',
    admin='admin'
}

interface Adress{
    city:string,
    street:string
}
interface IUserDocument extends Document {
    username: string,
    password: string,
    email: string,
    createdAt: Date,
    _doc: IUserDocument,
    role:Role,
    address:Adress[],
    uuid:string
}

const addressSchema:Schema=new Schema({
    city:String,
    street:String
})

const UserSchema: Schema<IUserDocument> = new Schema({
    username: {
        unique:true,
        type: String,
        required: [true, "Username must not be empty"],
        minlength: [3, "Username must be at least 3 characters long"]
    },
    address:{
        type:[addressSchema]
    },
    role:{
        type:String,
        enum:[Role.basic,Role.admin],
        default:Role.basic
    },
    uuid:{
        default:v4(),
        type:String
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        //   validate:{
        //       validator:isEmail
        //   }
        trim: true,
        match: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    },
    createdAt: Date
})

UserSchema.pre<IUserDocument>('save',async function  save(next:CallbackWithoutResultAndOptionalError){
      
        try {
            const hashPassword=await bcryptjs.hash(this.password,10);
            console.log(hashPassword,next)
        } catch (error) {
            
        }
})

UserSchema.index({username:1})

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('user', UserSchema);

export {
    User,
    IUserDocument
}