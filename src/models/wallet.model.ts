import { Prisma, PrismaClient, Wallet } from '@prisma/client';

const prisma = new PrismaClient();

export const getWalletById = async (id: number): Promise<Wallet | null> => {
    return await prisma.wallet.findFirst({ where: { id } });
}

export const getWalletByParam = async (params: Prisma.WalletWhereInput): Promise<Wallet | null> => {
    return await prisma.wallet.findFirst({ where: params });
}

export const createWallet = async (wallet: Wallet): Promise<Wallet> => {
    return await prisma.wallet.create({
        data: wallet,
    });
}

export const updateWallet = async (id: number, wallet: Partial<Wallet>): Promise<Wallet> => {
    return await prisma.wallet.update({
        where: { id },
        data: wallet
    });
}
