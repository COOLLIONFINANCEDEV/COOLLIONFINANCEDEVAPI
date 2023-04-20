import { Prisma, PrismaClient, Tenant } from '@prisma/client';
import { groupBy } from '../utils/group-by.helper';

const prisma = new PrismaClient();

export const getAllTenants = async ({ where, page, perPage }: { where?: Prisma.TenantWhereInput; page?: number; perPage?: number; } = {}): Promise<Tenant[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.tenant.findMany({
        where,
        ...paginate
    });
}

export const getTenantById = async (id: number): Promise<Tenant | null> => {
    return await prisma.tenant.findFirst({ where: { id, deleted: false } });
}

export const getTenantByParam = async (params: Prisma.TenantWhereInput): Promise<Tenant | null> => {
    return await prisma.tenant.findFirst({ where: params });
}

export const createTenant = async (tenant: Tenant): Promise<Tenant> => {
    return await prisma.tenant.create({
        data: tenant,
    });
}

export const updateTenant = async (id: number, tenant: Partial<Tenant>): Promise<Tenant> => {
    return await prisma.tenant.update({
        where: { id },
        data: tenant
    });
}


// Function to get total number of tenants
export const getTotalTenants = async (where?: Prisma.TenantWhereInput) => await prisma.tenant.count({ where });

// Function to get the number of user for one tenant
export const getUserCountByOneTenant = async (tenantId: number) => {
    const userTenants = await prisma.userTenant.groupBy({
        by: ['userId'],
        where: { tenantId }
    });

    return userTenants.length;
};

// Function to get the number of tenant per account type
export const getTotalTenantsPerAccountType = async () => {
    const count = await prisma.tenant.groupBy({
        by: ["accountTypeId"],
        _count: {
            _all: true,
        }
    });

    return count;
}

