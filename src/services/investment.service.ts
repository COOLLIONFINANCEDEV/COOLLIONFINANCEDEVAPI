import { Investment, Prisma } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/investment.model';

const pagination = appConfig.pagination;

export const getAllInvestments = async ({ where, page, perPage }: { where?: Prisma.InvestmentWhereInput; page?: number; perPage?: number; } = {}): Promise<Investment[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllInvestments({ where, page, perPage });
}

export const getInvestmentById = async (id: number): Promise<Investment | null> => {
    return await model.getInvestmentById(id);
}

export const getInvestmentByParam = async (where: Prisma.InvestmentWhereInput): Promise<Investment | null> => {
    return await model.getInvestmentByParam(where);
}

export const updateInvestment = async (id: number, project: Partial<Investment>): Promise<Investment> => {
    return await model.updateInvestment(id, project);
}

export const registerInvestment = async (project: Partial<Investment>): Promise<Investment> => {
    return await model.createInvestment(project as Required<Investment>);
}