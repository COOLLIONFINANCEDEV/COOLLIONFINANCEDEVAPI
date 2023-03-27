import { Prisma, Tenant } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/tenant.model';

const pagination = appConfig.pagination;

export const getAllTenants = async ({ where, page, perPage }: { where?: Prisma.TenantWhereInput; page?: number; perPage?: number; } = {}): Promise<Tenant[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllTenants({ where, page, perPage });
}

export const getTenantById = async (id: number): Promise<Tenant | null> => {
    return await model.getTenantById(id);
}

export const updateTenant = async (id: number, tenant: Partial<Tenant>): Promise<Tenant> => {
    return await model.updateTenant(id, tenant);
}

export const registerTenant = async (tenant: Partial<Tenant>): Promise<Tenant> => {
    return await model.createTenant(tenant as Required<Tenant>);
}