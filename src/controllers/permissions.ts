import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import StatusCodes from "http-status-codes";
import Permission from '../models/Permission';

export const permissionList = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const permission = await Permission.find();
        res.json({
            success: true,
            data: {
                permission
            }
        })
    } catch (error) {
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