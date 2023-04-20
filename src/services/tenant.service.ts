import { Prisma, Tenant } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/tenant.model';
import { TenantStats } from '../types/app.type';

const pagination = appConfig.pagination;

export const getAllTenants = async ({ where, page, perPage }: { where?: Prisma.TenantWhereInput; page?: number; perPage?: number; } = {}): Promise<Tenant[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllTenants({ where, page, perPage });
}

export const getTenantById = async (id: number): Promise<Tenant | null> => {
    return await model.getTenantById(id);
}

export const getTenantByParam = async (where: Prisma.TenantWhereInput): Promise<Tenant | null> => {
    return await model.getTenantByParam(where);
}

export const updateTenant = async (id: number, tenant: Partial<Tenant>): Promise<Tenant> => {
    return await model.updateTenant(id, tenant);
}

export const registerTenant = async (tenant: Partial<Tenant>): Promise<Tenant> => {
    return await model.createTenant(tenant as Required<Tenant>);
}

export const getTotalTenants = async () => await model.getTotalTenants();

// Get the number of tenants created within the last 24 hours
// const last24hNewTenants = async () => await model.getTotalTenants({ createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

// Get the number of tenants created within the last week
// const lastWeekNewTenants = async () => await model.getTotalTenants({ createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });

// Get the number of tenants created within the last month
// const lastMonthNewTenants = async () => await model.getTotalTenants({ createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

// Get the number of tenants created within the last year
// const lastYearNewTenants = async () => await model.getTotalTenants({ createdAt: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } });

// const getTotalTenantsPerAccountType = async () => await model.getTotalTenantsPerAccountType();

export const getUserCountByOneTenant = async (tenantId: number) => await model.getUserCountByOneTenant(tenantId);
