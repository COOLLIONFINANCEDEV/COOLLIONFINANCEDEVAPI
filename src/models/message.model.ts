import { Prisma, PrismaClient, Message } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMessages = async ({ where, page, perPage }: { where?: Prisma.MessageWhereInput; page?: number; perPage?: number; } = {}): Promise<Message[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.message.findMany({
        where,
        ...paginate
    });
}

export const getMessageById = async (id: number): Promise<Message | null> => {
    return await prisma.message.findFirst({ where: { id, deleted: false } });
}

export const getMessageByParam = async (params: Prisma.MessageWhereInput): Promise<Message | null> => {
    return await prisma.message.findFirst({ where: params });
}

export const createMessage = async (message: Message): Promise<Message> => {
    return await prisma.message.create({
        data: message,
    });
}

export const updateMessage = async (id: number, message: Partial<Message>): Promise<Message> => {
    return await prisma.message.update({
        where: { id },
        data: message
    });
}

