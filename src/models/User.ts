import bcryptjs  from 'bcryptjs';
// import isEmail from 'validator/lib/isEmail';
import mongoose, { Model, Schema, Document, HookNextFunction} from "mongoose";
import {v4} from 'uuid';
import jwt from "jsonwebtoken";
import { JwtPayload } from '../types/jwt';
// import { IPostDocument, postSchema } from './Post';
import { IPostDocument } from './Post';


enum Role{
    basic='basic',
    admin='admin'
}

interface Adress{
    city:string,
    street:string
}

interface IUserModel extends Model <IUserDocument>{
    admin:(username:string)=>Promise<IUserDocument>,
    // admin:()=>DocumentQuery<IUserDocument[], IUserDocument, {}>
    // orderByUsernameDesc:()=>DocumentQuery<IUserDocument[], IUserDocument, {}>
    orderByUsernameDesc:()=>Promise<IUserDocument>,
}
interface IUserDocument extends Document {
    username: string,
    password: string,
    email: string,
    // createdAt: Date,
    _doc: IUserDocument,
    role:Role,
    address:Adress[],
    uuid:string,
    generateToken:()=>string,
    // like_posts:IPostDocument[]
    like_posts:IPostDocument["_id"],
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
    // like_posts:{
    //     type:[postSchema]//这里把整个post都存储起来了
    // }
    like_posts:[
        {
        type:Schema.Types.ObjectId,//这里仅仅存储了Post的id
        ref:"Post"
    }
    ]
    // createdAt: Date
},{timestamps:true})

UserSchema.methods.generateToken=function ():string{
    const payload:JwtPayload={id:this.id}
    return jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:'4h'})
}

// UserSchema.static('admin',():DocumentQuery<(IUserDocument & { _id: any; }) | null,IUserDocument&{_id:any},{}>=>{
//     return User.findOne({username:'zyl'});
// })

UserSchema.statics.admin = function (username: string) {
    return this.findOne({ username });
};
UserSchema.statics.orderByUsernameDesc = function () {
    return User.find({}).sort({ username: -1 });
};

  
//   UserSchema.static("orderByUsernameDesc", ():DocumentQuery<IUserDocument[],IUserDocument,{}>=> {
//     return User.find({}).sort({ username: -1 });
//   });


UserSchema.pre<IUserDocument>('save',async function save(next:HookNextFunction){
       if(!this.isModified('password')){
           return next()
       }
        try {
            const hashPassword=await bcryptjs.hash(this.password,10);
            this.password=hashPassword;
            next()
        } catch (error) {
            next(error);
        }
})

UserSchema.index({username:1})

const User:IUserModel = mongoose.model<IUserDocument,IUserModel>('User', UserSchema);

export {
    User,
    IUserDocument
}