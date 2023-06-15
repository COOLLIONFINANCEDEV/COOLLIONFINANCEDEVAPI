import { Prisma, PrismaClient, Transaction } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTransactions = async ({ where, page, perPage }: { where?: Prisma.TransactionWhereInput; page?: number; perPage?: number; } = {}): Promise<Transaction[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.transaction.findMany({
        where,
        ...paginate
    });
}

export const getTransactionById = async (id: number): Promise<Transaction | null> => {
    return await prisma.transaction.findFirst({ where: { id } });
}

export const getTransactionByParam = async (params: Prisma.TransactionWhereInput) => {
    return await prisma.transaction.findFirst({
        where: params,
        include: {
            senderTenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    email2: true
                }
            }
        }
    });
}

export const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
    return await prisma.transaction.create({
        data: transaction,
    });
}

export const updateTransaction = async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
    return await prisma.transaction.update({
        where: { id },
        data: transaction,
    });
}

// Function to get total number of transaction
export const getTotalTransactions = async (where?: Prisma.TransactionWhereInput) => await prisma.transaction.count({ where });

