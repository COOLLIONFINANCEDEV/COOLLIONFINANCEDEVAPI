import { Prisma, PrismaClient, InvestmentTerm } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInvestmentTerms = async ({ where, page, perPage }: { where?: Prisma.InvestmentTermWhereInput; page?: number; perPage?: number; } = {}): Promise<InvestmentTerm[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.investmentTerm.findMany({
        where,
        ...paginate
    });
}

export const getInvestmentTermById = async (id: number): Promise<InvestmentTerm | null> => {
    return await prisma.investmentTerm.findFirst({ where: { id } });
}

export const getInvestmentTermByParam = async (params: Prisma.InvestmentTermWhereInput): Promise<InvestmentTerm | null> => {
    return await prisma.investmentTerm.findFirst({ where: params });
}

export const createInvestmentTerm = async (investmentTerm: InvestmentTerm): Promise<InvestmentTerm> => {
    return await prisma.investmentTerm.create({
        data: investmentTerm,
    });
}

export const updateInvestmentTerm = async (id: number, investmentTerm: Partial<InvestmentTerm>): Promise<InvestmentTerm> => {
    return await prisma.investmentTerm.update({
        where: { id },
        data: investmentTerm
    });
}

