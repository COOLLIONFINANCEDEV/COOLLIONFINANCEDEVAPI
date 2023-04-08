import { Prisma, PrismaClient, AccountTypeRole } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAccountTypeRole = async (where?: Prisma.AccountTypeRoleWhereInput): Promise<AccountTypeRole[]> => {
    return await prisma.accountTypeRole.findMany({ where });
}

export const getAccountTypeRoleById = async (id: number): Promise<AccountTypeRole | null> => {
    return await prisma.accountTypeRole.findUnique({ where: { id } });
}

export const getAccountTypeRoleByParam = async (params: Prisma.AccountTypeRoleWhereInput): Promise<AccountTypeRole | null> => {
    return await prisma.accountTypeRole.findFirst({ where: params });
}

export const createAccountTypeRole = async (accountTypeRole: AccountTypeRole): Promise<AccountTypeRole> => {
    return await prisma.accountTypeRole.create({
        data: accountTypeRole,
    });
}

export const deleteAccountTypeRole = async (accountTypeId: number, roleId: number): Promise<AccountTypeRole> => {
    return await prisma.accountTypeRole.delete({
        where: {
            accountTypeId_roleId: {
                roleId: accountTypeId,
                accountTypeId: roleId
            }
        },
    });
}

export const updateAccountTypeRole = async (id: number, accountTypeRole: Partial<AccountTypeRole>): Promise<AccountTypeRole> => {
    return await prisma.accountTypeRole.update({
        where: { id },
        data: accountTypeRole
    });
}
