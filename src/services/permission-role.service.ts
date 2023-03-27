import { PermissionRole, Prisma } from '@prisma/client';
import * as model from '../models/permission-role.model';

export const getAllPermissionRoles = async (where?: Prisma.PermissionRoleWhereInput): Promise<PermissionRole[]> => {
    return await model.getAllPermissionRoles(where);
}

export const getPermissionRoleById = async (id: number): Promise<PermissionRole | null> => {
    return await model.getPermissionRoleById(id);
}

export const updatePermissionRole = async (id: number, permissionRole: Partial<PermissionRole>): Promise<PermissionRole> => {
    return await model.updatePermissionRole(id, permissionRole);
}

export const deletePermissionRoleByPermRole = async (permissionId: number, roleId: number): Promise<PermissionRole> => {
    return await model.deletePermissionRoleByPermRole(permissionId, roleId);
}

export const attributePermissionToRole = async (permissionId: number, roleId: number): Promise<PermissionRole> => {
    return await model.createPermissionRole({ permissionId, roleId } as Required<PermissionRole>);
}