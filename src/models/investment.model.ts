import { Prisma, PrismaClient, Investment } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInvestments = async ({ where, page, perPage }: { where?: Prisma.InvestmentWhereInput; page?: number; perPage?: number; } = {}): Promise<Investment[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.investment.findMany({
        where,
        ...paginate
    });
}

export const getInvestmentById = async (id: number): Promise<Investment | null> => {
    return await prisma.investment.findFirst({ where: { id } });
}

export const getInvestmentByParam = async (params: Prisma.InvestmentWhereInput): Promise<Investment | null> => {
    return await prisma.investment.findFirst({ where: params });
}

export const createInvestment = async (investment: Investment): Promise<Investment> => {
    return await prisma.investment.create({
        data: investment,
    });
}

export const updateInvestment = async (id: number, investment: Partial<Investment>): Promise<Investment> => {
    return await prisma.investment.update({
        where: { id },
        data: investment
    });
}

// Function to get total number of investments
export const getTotalInvestments = async (where?: Prisma.InvestmentWhereInput) => await prisma.investment.count({ where });

// Function to get the number of investemnt for one tenant
export const getTotalInvestmentsPerTenant = async (tenantId: number) => await getTotalInvestments({ funder: tenantId });

// Function to get the total amount of investemnt for one tenant
export const getInvestmentsAmountPerProjectForOneTenant = async (tenantId: number) => {
    return await prisma.investment.groupBy({
        by: ["projectId"],
        where: {
            funder: tenantId,
        },
        _sum: {
            amount: true,
            dueAmount: true,
        }
    });
}

// Function to get total investment on one project
export const getTotalInvestmentPerProject = async (projectId: number) => await getTotalInvestments({ projectId });


export const getTotalInvestmentAmountPerTenant = async () => {
    return await prisma.investment.groupBy({
        by: ["funder"],
        _sum: {
            amount: true,
            dueAmount: true
        }
    });
};

export const getTotalInvestmentDueCollectedPerTenant = async () => {
    return await prisma.investment.groupBy({
        by: ["funder"],
        where: {
            gainCollected: true
        },
        _sum: {
            dueAmount: true,
        }
    });
};
