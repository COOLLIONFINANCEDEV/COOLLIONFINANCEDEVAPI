import { Prisma, PrismaClient, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPaymentMethods = async ({ where, page, perPage }: { where?: Prisma.PaymentMethodWhereInput; page?: number; perPage?: number; } = {}): Promise<PaymentMethod[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.paymentMethod.findMany({
        where,
        ...paginate
    });
}

export const getPaymentMethodById = async (id: number): Promise<PaymentMethod | null> => {
    return await prisma.paymentMethod.findFirst({ where: { id, deleted: false } });
}

export const getPaymentMethodByParam = async (params: Prisma.PaymentMethodWhereInput): Promise<PaymentMethod | null> => {
    return await prisma.paymentMethod.findFirst({ where: params });
}

export const createPaymentMethod = async (paymentMethod: PaymentMethod): Promise<PaymentMethod> => {
    return await prisma.paymentMethod.create({
        data: paymentMethod,
    });
}

export const updatePaymentMethod = async (id: number, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    return await prisma.paymentMethod.update({
        where: { id },
        data: paymentMethod
    });
}

