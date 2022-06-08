import express,{Express,NextFunction,Request,Response} from "express";
import mongoose from "mongoose";
import  StatusCodes from "http-status-codes";
import HttpException from "./exception/HttpException";
import { postLogin, postRegister,getCurrentUser as getCurrentUserForUser } from './controllers/user';
import bodyParser from "body-parser";
import   cors from 'cors';
import { errorMiddleware } from "./middlewares/error.middleware";
import 'dotenv/config'
import { getPosts, createPost, getPost, updatePost, deletePost, likePost } from './controllers/post';
import { checkAdminAuthMiddleware, checkAuthMiddleware } from "./middlewares/check-auth.middleware";
import morgan from "morgan";
import helmet from "helmet";
import { createComment,deleteComment } from './controllers/comments';
import { adminRegister, postAdminLogin, adminList, addAdmin, getCurrentUser, updateAdmin } from './controllers/admin';
// import { permit } from './middlewares/permission.middleware';
import { addRole, addRoleForAdmin, addRoleForPersmission, addRolesForAdmin, RoleList, updateRole } from "./controllers/role";
import { addPermission, permissionList, updatePermission, deletePermission } from './controllers/permissions';
import { allowRole } from './middlewares/role.middlewarte';
import cookieParser from "cookie-parser"
import { menusList, selectMenus, addMenu, updateMenu,fetch } from './controllers/menus';

const app:Express =express();

app.get('/',(_req:Request,res:Response)=>{
    res.json({
        message:"hello world"
    })
})

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    origin:'http://localhost:8000',
    credentials:true
}))
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/user/register',postRegister)
app.use('/user/login',postLogin)
app.get('/user/currentUser',checkAuthMiddleware,getCurrentUserForUser);
app.get('/posts',getPosts)
app.post('/posts',checkAuthMiddleware,createPost)
app.get('/posts/:id',checkAuthMiddleware,getPost)
app.put('/posts/:id',checkAuthMiddleware,updatePost)
app.delete('/posts/:id',checkAuthMiddleware,deletePost)
app.post('/posts/:id/like',checkAuthMiddleware,likePost)
app.post("/posts/:id/comment",checkAuthMiddleware,createComment)
app.delete("/posts/:id/comments/:commentId",checkAuthMiddleware,deleteComment)


app.use('/admin/register',adminRegister)
app.use('/admin/login',postAdminLogin)
app.get('/admin/user/currentUser',checkAdminAuthMiddleware,getCurrentUser);
app.get('/admin/users',checkAdminAuthMiddleware,allowRole('read admin'),adminList)
app.use('/admin/add',checkAdminAuthMiddleware,allowRole('add admin'),addAdmin)
app.put(
    "/admin/:id",
    checkAdminAuthMiddleware,
    allowRole("update admin"),
   updateAdmin
  );
app.get("/admin/roles",checkAdminAuthMiddleware,allowRole('read Role'),RoleList)
app.post('/admin/addRoles',checkAdminAuthMiddleware,allowRole('add Role'),addRole)
app.put("/admin/updateRole/:id",checkAdminAuthMiddleware,updateRole)
app.post("/admin/:id/role/:roleId",checkAdminAuthMiddleware,addRoleForAdmin)
app.post("/admin/:id/roles",checkAdminAuthMiddleware,addRolesForAdmin)
app.post("/admin/addPermissions",checkAdminAuthMiddleware,addPermission)
app.put("/admin/permission/:id",checkAdminAuthMiddleware,updatePermission)
app.delete("/admin/permission/:id",checkAdminAuthMiddleware,deletePermission)
app.get("/admin/permissions",checkAdminAuthMiddleware,permissionList)
app.post("/admin/roles/:id/permissions",checkAdminAuthMiddleware,addRoleForPersmission)
app.get("/admin/menus",checkAdminAuthMiddleware,allowRole('read menu'),menusList)
app.get('/admin/menus/selectMenus',checkAdminAuthMiddleware,selectMenus);
app.post('/admin/menus',checkAdminAuthMiddleware,allowRole('create menu'),addMenu)
app.put('/admin/menus/:id',checkAdminAuthMiddleware,allowRole('update menu'),updateMenu)
app.get("/admin/fetch", checkAdminAuthMiddleware, fetch);


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
