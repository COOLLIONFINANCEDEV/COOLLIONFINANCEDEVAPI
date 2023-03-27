import { Prisma, PrismaClient, Tenant } from '@prisma/client';

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
