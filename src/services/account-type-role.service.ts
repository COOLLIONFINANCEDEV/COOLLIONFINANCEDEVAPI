import { AccountTypeRole, Prisma } from '@prisma/client';
import * as model from '../models/account-type-role.model';

export const getAllAccountTypeRole = async (where?: Prisma.AccountTypeRoleWhereInput): Promise<AccountTypeRole[]> => {
    return await model.getAllAccountTypeRole(where);
}

export const getAccountTypeRoleById = async (id: number): Promise<AccountTypeRole | null> => {
    return await model.getAccountTypeRoleById(id);
}

export const getAccountTypeRoleByATId = async (accountTypeId: number): Promise<AccountTypeRole | null> => {
    return await model.getAccountTypeRoleByParam({
        accountTypeId
    });
}

export const updateAccountTypeRole = async (id: number, accountTypeRole: Partial<AccountTypeRole>): Promise<AccountTypeRole> => {
    return await model.updateAccountTypeRole(id, accountTypeRole);
}

export const registerAccountTypeRole = async (accountTypeRole: Partial<AccountTypeRole>): Promise<AccountTypeRole> => {
    return await model.createAccountTypeRole(accountTypeRole as Required<AccountTypeRole>);
}