import { Prisma, Transaction } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/transaction.model';

const pagination = appConfig.pagination;

export const getAllTransactions = async ({ where, page, perPage }: { where?: Prisma.TransactionWhereInput; page?: number; perPage?: number; } = {}): Promise<Transaction[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllTransactions({ where, page, perPage });
}

export const getTransactionById = async (id: number): Promise<Transaction | null> => {
    return await model.getTransactionById(id);
}

export const getTransactionByTransId = async (transactionId: string): Promise<Transaction | null> => {
    return await model.getTransactionByParam({ transactionId });
}

export const getTransactionByParam = async (where: Prisma.TransactionWhereInput): Promise<Transaction | null> => {
    return await model.getTransactionByParam(where);
}

export const registerTransaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
    return await model.createTransaction(transaction as Required<Transaction>);
}

export const updateTransaction = async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
    return await model.updateTransaction(id, transaction);
}
