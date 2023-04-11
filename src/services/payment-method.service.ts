import { PaymentMethod, Prisma } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/payment-method.model';

const pagination = appConfig.pagination;

export const getAllPaymentMethods = async ({ where, page, perPage }: { where?: Prisma.PaymentMethodWhereInput; page?: number; perPage?: number; } = {}): Promise<PaymentMethod[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllPaymentMethods({ where, page, perPage });
}

export const getPaymentMethodById = async (id: number): Promise<PaymentMethod | null> => {
    return await model.getPaymentMethodById(id);
}

export const getPaymentMethodByParam = async (where: Prisma.PaymentMethodWhereInput): Promise<PaymentMethod | null> => {
    return await model.getPaymentMethodByParam(where);
}

export const deletePaymentMethod = async (id: number): Promise<PaymentMethod> => {
    return await model.updatePaymentMethod(id, { deleted: true });
}

export const updatePaymentMethod = async (id: number, project: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    return await model.updatePaymentMethod(id, project);
}

export const registerPaymentMethod = async (project: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    return await model.createPaymentMethod(project as Required<PaymentMethod>);
}