import { Request, Response } from "express";
import { IAdminDocument } from "../models/Admin";
import { checkMenu } from "../utils/check-menu";
import Menu from "../models/Menu";
import HttpException from "../exception/HttpException";
import { StatusCodes } from "http-status-codes";
/**
 * Fetch menu list
 *
 * @Method GET
 * @URL /admin/menus/fetch
 *
 */
export const fetch = async (req: Request, res: Response, next: Function): Promise<void> => {
    try {
        const menus = await Menu.find({ parent: null }).populate("children");

        const admin = req.currentAdmin as IAdminDocument;

        res.json({
            success: true,
            data: checkMenu(menus, admin),
        });
    } catch (error) {
        next(error)
    }
}

/**
 * menu list
 *
 * @Method GET
 * @URL /admin/menus
 *
 */
export const menusList = async (req: Request, res: Response, next: Function): Promise<void> => {
    try {
        let { pageSize: oldPageSize, current: oldCurrent } = req.query;
        let pageSize = oldPageSize ? parseInt(oldPageSize as string) : 10;
        let current = oldCurrent ? parseInt(oldCurrent as string) : 10;

        [pageSize, current] = [+pageSize, +current];

        let menu: any = [];
        let count = 0;
        menu = await Menu.find()
            .sort({ createdAt: "desc" })
            .limit(pageSize)
            .skip((current - 1) * pageSize);
        count = await Menu.count({})

        res.json({
            success: true,
            data: menu,
            total: count,
            current,
            pageSize
        })



    } catch (error) {
        next(error)
    }
}

/**
 * Add menu
 *
 * @Method POST
 * @URL /admin/menus
 *
 */

export const addMenu=async (req: Request, res: Response, next: Function): Promise<void> => {
    try {
        const { name, path, parent, nameCn, permission } = req.body;

        const newMenu = new Menu({
            path,
            name,
            parent,
            nameCn,
            permission,
        });

        const resMenu = await newMenu.save();

        res.json({
            success: true,
            data: {
                menu: resMenu,
                message: "created successfully",
            },
        });
    } catch (error) {
        next(error)
    }
}


/**
 * Update menu
 *
 * @Method PUT
 * @URL /admin/menus/:id
 *
 */
export  const updateMenu= async (req: Request, res: Response, next: Function): Promise<void> => {
    try {
        const { name, path, parent, nameCn, permission } = req.body;

        const { id } = req.params;

        const menu = await Menu.findById(id);

        if (menu) {
            const resMenu = await Menu.findByIdAndUpdate(
                id,
                { name, path, parent, nameCn, permission },
                { new: true }
            );

            res.json({
                success: true,
                data: {
                    menu: resMenu,
                    message: "updated successfully",
                },
            });
        } else {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                'Menu not found'
              );
        }
    } catch (error) {
        next(error)
    }
}


/**
 * Fetch selected menu list
 *
 * @Method GET
 * @URL /admin/menus/selectMenus
 *
 */

export const selectMenus= async (_req: Request, res: Response, next: Function): Promise<void> => {
    try {
        const menus = await Menu.find();
        res.json({
            success: true,
            data: menus,
        });
    } catch (error) {
        next(error)
    }
}
