import { Prisma, Wallet } from '@prisma/client';
import * as model from '../models/wallet.model';

export const getWalletById = async (id: number): Promise<Wallet | null> => {
    return await model.getWalletById(id);
}

export const getWalletByTenantId = async (tenantId: number): Promise<Wallet | null> => {
    return await model.getWalletByParam({ owner: tenantId });
}

export const getWalletByParam = async (where: Prisma.WalletWhereInput): Promise<Wallet | null> => {
    return await model.getWalletByParam(where);
}

export const updateWallet = async (id: number, project: Partial<Wallet>): Promise<Wallet> => {
    return await model.updateWallet(id, project);
}

export const registerWallet = async (project: Partial<Wallet>): Promise<Wallet> => {
    return await model.createWallet(project as Required<Wallet>);
}