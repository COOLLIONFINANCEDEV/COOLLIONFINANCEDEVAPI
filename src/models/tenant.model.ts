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

// Récupérer le nombre total de tenants
export const totalTenants = async () => await prisma.tenant.count();

// Récupérer le nombre de tenants supprimés
export const deletedTenants = async () => await prisma.tenant.count({ where: { deleted: true } });

// Récupérer le nombre de tenants créés par jour
export const tenantsCreatedPerDay = async () => await prisma.tenant.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });

// Récupérer le nombre de tenants créés par semaine
export const tenantsCreatedPerWeek = async () => await prisma.tenant.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } });

// Récupérer le nombre de tenants créés par mois
export const tenantsCreatedPerMonth = async () => await prisma.tenant.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } });

// Récupérer le nombre de tenants créés par année
export const tenantsCreatedPerYear = async () => await prisma.tenant.count({ where: { createdAt: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } });

// Récupérer le nombre de transactions reçues par tenant
export const transactionsReceivedPerTenant = async () => await prisma.tenant.findMany({ include: { receivedTransactions: true } });

// Récupérer le nombre de transactions envoyées par tenant
export const transactionsSentPerTenant = async () => await prisma.tenant.findMany({ include: { transactionsSent: true } });

// Récupérer le nombre de projets associés à chaque tenant
export const projectsPerTenant = async () => await prisma.tenant.findMany({ include: { projects: true } });

// Récupérer le nombre d'investissements associés à chaque tenant
export const investmentsPerTenant = async () => await prisma.tenant.findMany({ include: { investments: true } });

// Récupérer le nombre de portefeuilles associés à chaque tenant
// export const walletPerTenant = async () => await prisma.tenant.findMany({ include: { wallet: true } });

// Récupérer le nombre d'invitations envoyées par chaque tenant
export const invitationsSentPerTenant = async () => await prisma.tenant.findMany({ include: { invitationsSent: true } });

// Récupérer le nombre de rôles associés à chaque tenant
export const rolesPerTenant = async () => await prisma.tenant.findMany({ include: { roles: true } });

// Récupérer le nombre d'utilisateurs associés à chaque tenant
export const usersPerTenant = async () => await prisma.tenant.findMany({ include: { userTenant: true } });

// Récupérer le nombre de chambres associées à chaque tenant
export const roomsPerTenant = async () => await prisma.tenant.findMany({ include: { rooms: true } });


