import { Prisma, UserTenant } from "@prisma/client";
import { app as appConfig } from '../configs/app.conf';
import * as model from "../models/users-tenants.model";

const pagination = appConfig.pagination;

export const getAllUserTenants = async ({ where, page, perPage }: { where?: Prisma.UserTenantWhereInput; page?: number; perPage?: number; } = {}) => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllUserTenants({ where, page, perPage });
}

export const getUserTenantById = async (id: number) => {
    return await model.getUserTenantById(id);
}

export const getUserTenantByUserId = async (id: number) => {
    return await model.getAllUserTenants({ where: { userId: id } });
};

export const getUserTenantByParam = async (where: Prisma.UserTenantWhereInput) => {
    return await model.getUserTenantByParam(where);
}

export const deleteUserTenant = async (id: number) => {
    return await model.deleteUserTenant(id);
}

export const updateUserTenant = async (id: number, project: Partial<UserTenant>) => {
    return await model.updateUserTenant(id, project);
}

export const attributeUserToTenant = async (userTenant: Partial<UserTenant>) => {
    return await model.createUserTenant(userTenant as Required<UserTenant>);
};
