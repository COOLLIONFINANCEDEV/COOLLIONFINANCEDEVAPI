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

export const updateInvestmentByTransactionId = async (transactionId: string, investment: Partial<Investment>): Promise<Investment> => {
    return await prisma.investment.update({
        where: { transactionId },
        data: investment
    });
}

