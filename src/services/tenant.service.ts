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

export const getTenantStats = async (): Promise<TenantStats> => {
    const totalTenants = await model.totalTenants();
    const deletedTenants = await model.deletedTenants();
    const tenantsCreatedPerDay = await model.tenantsCreatedPerDay();
    const tenantsCreatedPerWeek = await model.tenantsCreatedPerWeek();
    const tenantsCreatedPerMonth = await model.tenantsCreatedPerMonth();
    const tenantsCreatedPerYear = await model.tenantsCreatedPerYear();
    const transactionsReceivedPerTenant = await model.transactionsReceivedPerTenant();
    const transactionsSentPerTenant = await model.transactionsSentPerTenant();
    const projectsPerTenant = await model.projectsPerTenant();
    const investmentsPerTenant = await model.investmentsPerTenant();
    const walletPerTenant = await model.walletPerTenant();
    const invitationsSentPerTenant = await model.invitationsSentPerTenant();
    const rolesPerTenant = await model.rolesPerTenant();
    const usersPerTenant = await model.usersPerTenant();
    const roomsPerTenant = await model.roomsPerTenant();
    const tenantStats: TenantStats = {
        totalTenants,
        deletedTenants,
        tenantsCreatedPerDay,
        tenantsCreatedPerWeek,
        tenantsCreatedPerMonth,
        tenantsCreatedPerYear,
        transactionsReceivedPerTenant: transactionsReceivedPerTenant.map(tenant => ({ tenantId: tenant.id, transactionCount: tenant.receivedTransactions.length })),
        transactionsSentPerTenant: transactionsSentPerTenant.map(tenant => ({ tenantId: tenant.id, transactionCount: tenant.transactionsSent.length })),
        projectsPerTenant: projectsPerTenant.map(tenant => ({ tenantId: tenant.id, projectCount: tenant.projects.length })),
        investmentsPerTenant: investmentsPerTenant.map(tenant => ({ tenantId: tenant.id, investmentCount: tenant.investments.length })),
        walletPerTenant: walletPerTenant.map(tenant => ({ tenantId: tenant.id, walletCount: tenant.wallet.length })),
        invitationsSentPerTenant: invitationsSentPerTenant.map(tenant => ({ tenantId: tenant.id, invitationCount: tenant.invitationsSent.length })),
        rolesPerTenant: rolesPerTenant.map(tenant => ({ tenantId: tenant.id, roleCount: tenant.roles.length })),
        usersPerTenant: usersPerTenant.map(tenant => ({ tenantId: tenant.id, userCount: tenant.userTenant.length })),
        roomsPerTenant: roomsPerTenant.map(tenant => ({ tenantId: tenant.id, roomCount: tenant.rooms.length })),
    };
    return tenantStats;
}
