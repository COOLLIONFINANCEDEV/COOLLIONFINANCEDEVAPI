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

export const updateInvestment = async (unique: {id?: number, transactionId?: string}, project: Partial<Investment>): Promise<Investment | null> => {
    if (unique.id)
        return await model.updateInvestment(unique.id, project);
    else if (unique.transactionId)
        return await model.updateInvestmentByTransactionId(unique.transactionId, project);
    else return null;
}

export const registerInvestment = async (project: Partial<Investment>): Promise<Investment> => {
    return await model.createInvestment(project as Required<Investment>);
}

// Function to get total number of investments
export const getTotalInvestments = async () => await model.getTotalInvestments();

// Function to get the number of investemnt for one tenant
export const getTotalInvestmentsPerTenant = async (tenantId: number) => await model.getTotalInvestments({ funder: tenantId, done: true });

// Function to get the total amount of investemnt for one tenant
export const getInvestmentsAmountPerProjectForOneTenant = async (tenantId: number) =>
    await model.getInvestmentsAmountPerProjectForOneTenant(tenantId);

export const getTotalInvestmentPerProject = async (projectId: number) => await model.getTotalInvestments({ projectId, done: true });

export const getTotalInvestmentAmountPerTenant = async (where: Prisma.InvestmentWhereInput) =>
    model.getTotalInvestmentAmountPerTenant();

export const getTotalInvestmentDueCollectedPerTenant = async (where: Prisma.InvestmentWhereInput) =>
    model.getTotalInvestmentDueCollectedPerTenant();

