import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import StatusCodes from "http-status-codes";
import Role from '../models/Role';
import Admin from '../models/Admin';

export const updateRole=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{

      try {
          const {name,nameCn} =req.body;
          const {id} =req.params;
          const role=await Role.findById(id);
         if(role){
             const newRole = await Role.findByIdAndUpdate(id,{name,nameCn},{new:true})
             res.json({
                 successfull:true,
                 data:newRole
             })
         }else{
             next(new HttpException(StatusCodes.NOT_FOUND,"Role not found"))
         }
      
      } catch (error) {
          next(error)
      }

}

 export const RoleList=async (_req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
    const  roles=await Role.find();
     res.json({
       successfull:true,
       data:{
         roles
       }
     })
  } catch (error) {
    next(error)
  }

}

export const addRole=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
   
    const {name,nameCn} =req.body;
 
    const role=new Role({
      name,
      nameCn
    })
    const newRole=await role.save()

     res.json({
       successfull:true,
       data:{
         role:newRole,
         message:'created successfully'
       }
     })
  } catch (error) {
    next(error)
  }

}



export const addRoleForAdmin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
      const { id,roleId } =req.params;
  
      const admin = await Admin.findById(id);
     if(!admin){
        throw new HttpException(
            StatusCodes.UNPROCESSABLE_ENTITY,
            "admin not found",
          );
     }

     const role=await Role.findById(roleId);
     if(!role){
         throw new HttpException(
             StatusCodes.NOT_FOUND,
             "role not found"
         )
     }
     if(role&&admin){
         admin.role=roleId
     
      const resAdmin=await admin.save()
  
       res.json({
         successfull:true,
         data:{
           admin:resAdmin
         }
       })
    }
    } catch (error) {
      next(error)
    }
  
  }