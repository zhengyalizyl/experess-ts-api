import { NextFunction,Request,Response } from "express";

export const getPosts=async (_req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {

     const posts=await Post.find();
      res.json({
         successfull:true,
         data:{posts}
      })
  } catch (error) {
      next(error)
  }
}