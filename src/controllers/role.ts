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
                 success:true,
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
       success:true,
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
       success:true,
       data:{
         role:newRole,
         message:'created successy'
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
         success:true,
         data:{
           admin:resAdmin
         }
       })
    }
    } catch (error) {
      next(error)
    }
  
  }
export const addRolesForAdmin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
      const { id } =req.params;
      const {roleIds}=req.body;
  
      const admin = await Admin.findById(id);
     if(!admin){
        throw new HttpException(
            StatusCodes.UNPROCESSABLE_ENTITY,
            "admin not found",
          );
     }

     admin.roles=roleIds;
     await admin.save();
     const resAdmin=await Admin.findById(id)
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
export const addRoleForPersmission=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
      const { id } =req.params;
      const { permissionIds} =req.body
      const role = await Role.findById(id);
     if(!role){
        throw new HttpException(
            StatusCodes.UNPROCESSABLE_ENTITY,
            "role not found",
          );
     }
    role.permissions=permissionIds;
    await role.save();
     const restRole=await Role.findById(id)
  
       res.json({
         success:true,
         data:{
           role:restRole
         }
       })
    } catch (error) {
      next(error)
    }
  
  }


  