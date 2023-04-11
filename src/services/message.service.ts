import { Prisma, Message } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/message.model';

const pagination = appConfig.pagination;

export const getAllMessages = async ({ where, page, perPage }: { where?: Prisma.MessageWhereInput; page?: number; perPage?: number; } = {}): Promise<Message[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllMessages({ where, page, perPage });
}

export const getMessageById = async (id: number): Promise<Message | null> => {
    return await model.getMessageById(id);
}

export const getMessageByParam = async (where: Prisma.MessageWhereInput): Promise<Message | null> => {
    return await model.getMessageByParam(where);
}

export const deleteMessage = async (id: number): Promise<Message> => {
    return await model.updateMessage(id, { deleted: true });
}

export const updateMessage = async (id: number, message: Partial<Message>): Promise<Message> => {
    return await model.updateMessage(id, message);
}

export const registerMessage = async (message: Partial<Message>): Promise<Message> => {
    return await model.createMessage(message as Required<Message>);
}
