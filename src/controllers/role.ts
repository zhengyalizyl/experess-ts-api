import { NextFunction, Response, Request } from 'express';
import HttpException from '../exception/HttpException';
import StatusCodes from "http-status-codes";
import Role from '../models/Role';
import Admin from '../models/Admin';

export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
    const { name, nameCn } = req.body;
    const { id } = req.params;
    const role = await Role.findById(id);
    if (role) {
      const newRole = await Role.findByIdAndUpdate(id, { name, nameCn }, { new: true })
      res.json({
        success: true,
        data: newRole
      })
    } else {
      next(new HttpException(StatusCodes.NOT_FOUND, "Role not found"))
    }

  } catch (error) {
    next(error)
  }

}

export const RoleList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {

    let { pageSize: oldPageSize, current: oldCurrent } = req.query;
    let pageSize = oldPageSize ? parseInt(oldPageSize as string) : 10;
    let current = oldCurrent ? parseInt(oldCurrent as string) : 1;

    [pageSize, current] = [+pageSize, +current];

    let roles: any = [];
    let count = 0;
    roles = await Role.find()
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip((current - 1) * pageSize);
    count = await Role.count({})



    res.json({
      success: true,
      data: roles,
      total: count,
      current,
      pageSize
    })


  } catch (error) {
    console.dir(error)
    next(error)
  }




}

export const addRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { name, nameCn } = req.body;

    const role = new Role({
      name,
      nameCn
    })
    const newRole = await role.save()

    res.json({
      success: true,
      data: {
        role: newRole,
        message: 'created successy'
      }
    })
  } catch (error) {
    next(error)
  }

}



export const addRoleForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, roleId } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "admin not found",
      );
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "role not found"
      )
    }

      const resAdmin = await Admin.findByIdAndUpdate(
        id,
        { role: roleId},
        { new: true }
      );
      res.json({
        success: true,
        data: {
          admin: resAdmin
        }
      })
  
  } catch (error) {
    next(error)
  }

}
export const addRolesForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(req.params)
  try {
    const { id } = req.params;
    const { roleIds } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "admin not found",
      );
    }

    const resAdmin = await Admin.findByIdAndUpdate(
      id,
      { roles: roleIds },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        menu: resAdmin,
        message: "updated successfully",
      },
    });

  } catch (error) {
    next(error)
  }

}
export const addRoleForPersmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body
    const role = await Role.findById(id);
    if (!role) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "role not found",
      );
    }
    const restRole = await Role.findByIdAndUpdate(
      id,
      { permissions: permissionIds },
      { new: true }
    );


    res.json({
      success: true,
      data: {
        role: restRole
      }
    })
  } catch (error) {
    next(error)
  }

}


