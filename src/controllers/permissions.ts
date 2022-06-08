import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import StatusCodes from "http-status-codes";
import Permission from '../models/Permission';

export const permissionList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    try {

        let { pageSize: oldPageSize, current: oldCurrent } = req.query;
        let pageSize = oldPageSize ? parseInt(oldPageSize as string) : 10;
        let current = oldCurrent ? parseInt(oldCurrent as string) : 10;
    
        [pageSize, current] = [+pageSize, +current];
    
        let permission: any = [];
        let count = 0;
        permission = await Permission.find()
            .sort({ createdAt: "desc" })
            .limit(pageSize)
            .skip((current - 1) * pageSize);
          count = await Permission.count({})
        
        res.json({
          success: true,
          data: permission,
          total: count,
          current,
          pageSize
        })
    
    
      } catch (error) {
        console.dir(error)
        next(error)
      }
}

export const addPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, nameCn } = req.body;

        const permission = new Permission({
            name,
            nameCn
        })
        const resPermission = await permission.save()

        res.json({
            success: true,
            data: {
                permission: resPermission
            }
        })
    } catch (error) {
        next(error)
    }

}
export const updatePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, nameCn } = req.body;
        const { id } = req.params;

        const permission = await Permission.findById(id);
        if (permission) {
            const resPermission = await Permission.findByIdAndUpdate(
                id,
                { name, nameCn },
                { new: true }
            );

            res.json({
                success: true,
                data: {
                    permission: resPermission,
                    message: "updated successy"
                }
            });
        } else {
            throw new HttpException(StatusCodes.NOT_FOUND, 'permission not found')
        }
    } catch (error) {
        next(error)
    }

}
export const deletePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);
        if (permission) {
            await Permission.findByIdAndDelete(id);

            res.json({
                success: true,
                data: {
                    message: "deleted successy"
                }
            });
        } else {
            throw new HttpException(StatusCodes.NOT_FOUND, 'permission not found')
        }
    } catch (error) {
        next(error)
    }

}