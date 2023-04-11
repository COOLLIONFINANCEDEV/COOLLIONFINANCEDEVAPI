import { Prisma, Role } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/role.model';

const pagination = appConfig.pagination;

export const getAllRoles = async ({ where, page, perPage }: { where?: Prisma.RoleWhereInput; page?: number; perPage?: number; } = {}): Promise<Role[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllRoles({ where, page, perPage });
}

export const getRoleById = async (id: number): Promise<Role | null> => {
    return await model.getRoleById(id);
}

export const getRoleByParam = async (where: Prisma.RoleWhereInput): Promise<Role | null> => {
    return await model.getRoleByParam(where);
}

export const getRoleByName = async (roleName: string): Promise<Role | null> => {
    return await model.getRoleByParam({
        name: roleName,
    });
}

export const deleteRole = async (roleId: number): Promise<Role> => {
    return model.deleteRole(roleId);
}

export const updateRole = async (id: number, role: Partial<Role>): Promise<Role> => {
    return await model.updateRole(id, role);
}

export const registerRole = async (role: Partial<Role>): Promise<Role> => {
    return await model.createRole(role as Required<Role>);
}