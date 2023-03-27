import { UsersPermissions } from "@prisma/client";
import * as model from "../models/users-permissions.model";

export const getUsersPermissionsByUserId = async (id: number) => {
    return await model.getUsersPermissionsByUserId(id);
}

export const getAllUsersPermissions = async (): Promise<UsersPermissions[]> => {
    return await model.getAllUsersPermissions();
}

export const getUsersPermissionById = async (id: number): Promise<UsersPermissions | null> => {
    return await model.getUsersPermissionsById(id);
}

export const updateUsersPermission = async (id: number, usersPermissions: Partial<UsersPermissions>): Promise<UsersPermissions> => {
    return await model.updateUsersPermissions(id, usersPermissions);
}

export const registerUsersPermission = async (usersPermissions: Partial<UsersPermissions>): Promise<UsersPermissions> => {
    return await model.createUsersPermissions(usersPermissions as Required<UsersPermissions>);
}