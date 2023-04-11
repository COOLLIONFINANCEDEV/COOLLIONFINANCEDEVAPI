import { AccountType, Prisma } from '@prisma/client';
import * as model from '../models/account-type.model';

export const getAllAccountType = async (where?: Prisma.AccountTypeWhereInput) => {
    return await model.getAllAccountType(where);
}

export const getAccountTypeById = async (id: number): Promise<AccountType | null> => {
    return await model.getAccountTypeById(id);
}

export const updateAccountType = async (id: number, accountTypeRole: Partial<AccountType>): Promise<AccountType> => {
    return await model.updateAccountType(id, accountTypeRole);
}

export const deleteAccountType = async (id: number): Promise<AccountType> => {
    return await model.deleteAccountType(id);
}

export const registerAccountType = async (accountTypeRole: Partial<AccountType>): Promise<AccountType> => {
    return await model.createAccountType(accountTypeRole as Required<AccountType>);
}