import { InvestmentTerm, Prisma } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/investment-term.model';

const pagination = appConfig.pagination;

export const getAllInvestmentTerms = async ({ where, page, perPage }: { where?: Prisma.InvestmentTermWhereInput; page?: number; perPage?: number; } = {}): Promise<InvestmentTerm[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllInvestmentTerms({ where, page, perPage });
}

export const getInvestmentTermById = async (id: number): Promise<InvestmentTerm | null> => {
    return await model.getInvestmentTermById(id);
}

export const getInvestmentTermByParam = async (where: Prisma.InvestmentTermWhereInput): Promise<InvestmentTerm | null> => {
    return await model.getInvestmentTermByParam(where);
}

export const updateInvestmentTerm = async (id: number, project: Partial<InvestmentTerm>): Promise<InvestmentTerm> => {
    return await model.updateInvestmentTerm(id, project);
}

export const registerInvestmentTerm = async (project: Partial<InvestmentTerm>): Promise<InvestmentTerm> => {
    return await model.createInvestmentTerm(project as Required<InvestmentTerm>);
}