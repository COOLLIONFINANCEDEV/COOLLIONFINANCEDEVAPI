import { UserRole, Prisma } from '@prisma/client';
import * as model from '../models/user-role.model';

export const getAllUserRoles = async (where?: Prisma.UserRoleWhereInput) => {
    return await model.getAllUserRoles(where);
}

export const getUserRoleById = async (id: number): Promise<UserRole | null> => {
    return await model.getUserRoleById(id);
}

export const updateUserRole = async (id: number, userRole: Partial<UserRole>): Promise<UserRole> => {
    return await model.updateUserRole(id, userRole);
}

export const deleteUserRoleByPermRole = async (userId: number, roleId: number): Promise<UserRole> => {
    return await model.deleteUserRoleByPermRole(userId, roleId);
}

export const attributeUserToRole = async (userId: number, roleId: number): Promise<UserRole> => {
    return await model.createUserRole({ userId, roleId } as Required<UserRole>);
}