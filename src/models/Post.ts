import { model,Schema,Document,PaginateModel } from "mongoose";
import { IUserDocument } from "./User";
import  mongoosePageination from 'mongoose-paginate-v2'

interface Like{
    username:IUserDocument["username"],
    createAt:string
}

interface IPostModel extends PaginateModel<IPostDocument>{}
export interface IPostDocument extends Document{
     body:string,
     createAt:String,
     username:IUserDocument["username"],
     user:IUserDocument["_id"],
     likes:Like[]
}


export const postSchema:Schema=new Schema({
    body:String,
    createAt:String,
    username:String,
    user:{
        type:Schema.Types.ObjectId,//一对一的
        ref:"User",
        required:true
    },
    likes:[//这里的post是多多的关系,即一个post可以被多人喜欢，一个人喜欢多个post
        {
            username:String,
            createAt:String
        }
    ]
})

postSchema.plugin(mongoosePageination)

const Post:IPostModel=model<IPostDocument,IPostModel>("Post",postSchema);

export default Post;