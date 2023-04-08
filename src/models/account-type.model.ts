import { Prisma, PrismaClient, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAccountType = async (where?: Prisma.AccountTypeRoleWhereInput) => {
    return await prisma.accountType.findMany({
        where,
        include: {
            accountsTypesRoles: {
                select: {
                    role: true
                }
            },
            accountsTypesPermissions: {
                select: {
                    permission: true
                }
            }
        }
    });
}

export const getAccountTypeById = async (id: number): Promise<AccountType | null> => {
    return await prisma.accountType.findUnique({ where: { id } });
}

export const getAccountTypeByParam = async (params: Prisma.AccountTypeWhereInput): Promise<AccountType | null> => {
    return await prisma.accountType.findFirst({ where: params });
}

export const deleteAccountType = async (id: number): Promise<AccountType> => {
    return await prisma.accountType.delete({ where: { id } });
}

export const createAccountType = async (accountType: AccountType): Promise<AccountType> => {
    return await prisma.accountType.create({
        data: accountType,
    });
}

export const updateAccountType = async (id: number, accountType: Partial<AccountType>): Promise<AccountType> => {
    return await prisma.accountType.update({
        where: { id },
        data: accountType
    });
}
