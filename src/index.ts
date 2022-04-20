import express,{Express,NextFunction,Request,Response} from "express";
import mongoose from "mongoose";
import  StatusCodes from "http-status-codes";
import HttpException from "./exception/HttpException";
import { postLogin, postRegister} from "./controllers/user";
import bodyParser from "body-parser";
import   cors from 'cors';
import { errorMiddleware } from "./middlewares/error.middleware";
import 'dotenv/config'
import { getPosts, createPost, getPost, updatePost, deletePost, likePost } from './controllers/post';
import { checkAuthMiddleware } from "./middlewares/check-auth.middleware";
import morgan from "morgan";
import helmet from "helmet";
import { createComment,deleteComment } from './controllers/comments';
import { adminRegister } from './controllers/admin';

const app:Express =express();


app.get('/',(_req:Request,res:Response)=>{
    res.json({
        message:"hello world"
    })
})

app.use(morgan("dev"));
app.use(helmet());
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/user/register',postRegister)
app.use('/user/login',postLogin)
app.get('/posts',getPosts)
app.post('/posts',checkAuthMiddleware,createPost)
app.get('/posts/:id',checkAuthMiddleware,getPost)
app.put('/posts/:id',checkAuthMiddleware,updatePost)
app.delete('/posts/:id',checkAuthMiddleware,deletePost)
app.post('/posts/:id/like',checkAuthMiddleware,likePost)
app.post("/posts/:id/comment",checkAuthMiddleware,createComment)
app.delete("/posts/:id/comments/:commentId",checkAuthMiddleware,deleteComment)
app.use('/admin/login',adminRegister)


app.use((_req:Request,_res:Response,next:NextFunction)=>{
    const error: HttpException=new HttpException(StatusCodes.NOT_FOUND,'Router Not found')
    next(error);
})

app.use(errorMiddleware)



const port:number|string=process.env.PORT||6060

const main=async ()=>{
     await mongoose.connect("mongodb://localhost:27017/tsExpress")
    app.listen(port,()=>{
        console.log('Run at '+port)
    })
}

main();


