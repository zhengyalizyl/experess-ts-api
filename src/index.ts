import express,{Express,NextFunction,Request,Response} from "express";
import mongoose from "mongoose";
import  StatusCodes from "http-status-codes";
import HttpException from "./exception/HttpException";
import { postRegister} from "./controllers/user";
import bodyParser from "body-parser";
import   cors from 'cors';
import { errorMiddleware } from "./middlewares/error.middleware";

const app:Express =express();


app.get('/',(_req:Request,res:Response)=>{
    res.json({
        message:"hello world"
    })
})


app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/user/register',postRegister)

app.use((_req:Request,_res:Response,next:NextFunction)=>{
    const error=new HttpException(StatusCodes.NOT_FOUND,'Router Not found')
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


