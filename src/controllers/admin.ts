import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import { validateAdminRegisterInput, validateAdminLoginInput, AdminLoginInputError } from '../utils/validator';
import StatusCodes from "http-status-codes";
import Admin,{ IAdminDocument } from '../models/Admin';
import bcryptjs from "bcryptjs";

export const adminRegister = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const { username, password,confirmPassword,role } = req.body;
      const { valid, errors } = validateAdminRegisterInput({ username, password,confirmPassword});
      if (!valid) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "User register input error",
          errors
        );
      }
      const findUser = await Admin.findOne({ username });
      if (findUser) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "Username  is taken",
          { username: 'The username is taken' }
        );
  
      }
  
    const hashPassword =await bcryptjs.hash(password,10);

      const admin: IAdminDocument = new Admin({
        username,
        password:hashPassword,
        isAdmin:true,
        role
      })
  
      
  
      const newAdmin: IAdminDocument = await admin.save();
      const token =newAdmin.generateToken();
  
      res.json({
        success: true,
        data: {
          token
        }
      })
  
    } catch (error) {
      next(error);
    }
  }

  const throwLoginValidateError=(errors:AdminLoginInputError)=>{
    throw new HttpException(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Admin login input error",
      errors
    );
  }

  export const postAdminLogin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
       const {username,password} =req.body;
       const {errors,valid} =validateAdminLoginInput({username,password});
 
       if(!valid){
         return throwLoginValidateError(errors);
       }
       const findUser = await Admin.findOne({ username });
       if (!findUser) {
         errors.general='admin User not found'
         return throwLoginValidateError(errors);
       };
 
       const match = await bcryptjs.compare(password, findUser.password);
 
     if (!match) {
       errors.general = "Wrong credentials";
       return throwLoginValidateError(errors);
     }
     const token =findUser.generateToken();
       res.json({
         success:true,
         data:{
           token
         }
       })
    } catch (error) {
      next(error)
    }
 
 }


 export const adminList=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {

    let { pageSize:oldPageSize, current:oldCurrent,isAdmin } = req.query;
     let pageSize=oldPageSize?parseInt(oldPageSize as string):10;
    let current=oldCurrent?parseInt(oldCurrent as string):10;

    [pageSize, current] = [+pageSize, +current];
     
    console.log(isAdmin)
    let admins:any=[];
    let count=0;
    if(isAdmin==='all'){
    admins=await Admin.find()
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip((current - 1) * pageSize);
      count=await Admin.count({})
    }else{
      admins=await Admin.find({isAdmin})
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip((current - 1) * pageSize);
      count=await Admin.count({isAdmin})
    }
  
   
     res.json({
       success:true,
       data:admins,
       total:count,
       current,
       pageSize
     })


  } catch (error) {
    console.dir(error)
    next(error)
  }

}


export const addAdmin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
   
    const {username,password} =req.body;
    const {errors,valid} =validateAdminLoginInput({username,password});

    if(!valid){
      return throwLoginValidateError(errors);
    }

    const findUser = await Admin.findOne({ username });
      if (findUser) {
        throw new HttpException(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "Username  is taken",
          { username: 'The username is taken' }
        );
  
      }

    const hashedPassword=await bcryptjs.hash(password,10);
    const admin=new Admin({
      username,
      password:hashedPassword,
      isadmin:false
    })
    const resAdmin=await admin.save()

     res.json({
       success:true,
       data:{
         admin:resAdmin
       }
     })
  } catch (error) {
    next(error)
  }

}



export const getCurrentUser = async (req: Request, res: Response, next: Function): Promise<void> => {

  try {
    const admin = req.currentAdmin as IAdminDocument;
    res.json({
      success: true,
      data: {
        userid: admin._id,
        name:admin.username,
        avatar:
          "https://www.qiuzhi99.com/assets/logo-f46be81047e24aa656ea1048aa0c078e6168bb324c3df36506c014c1be677235.png"
      }
    });
  } catch (error) {
    next(error)
  }

}

/*
* Update admin
*
* @Method PUT
* @URL /api/admin/:id
*
*/
export const updateAdmin = async (req: Request, res: Response, next: Function): Promise<void> => {
 
  try {
    const { username, password } = req.body;
    const {errors,valid} =validateAdminLoginInput({username,password});
    if (!valid) {
      return throwLoginValidateError(errors);
    }
 
    const { id } = req.params;
    const admin = await Admin.findById(id);
 
    if (admin) {
      const hashPassword =await bcryptjs.hash(password,10);
 
      const resAdmin = await Admin.findByIdAndUpdate(
        id,
        { username: username, password: hashPassword },
        { new: true }
      );
 
      res.json({
        success: true,
        data: {
          admin: resAdmin,
          message: "updated successfully",
        },
      });
    } else {
      errors.general='admin User not found'
      return throwLoginValidateError(errors);
    }
  } catch (error) {
    next(error)
  }
 }

