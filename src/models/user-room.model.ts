import { Prisma, PrismaClient, UserRoom } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUserRooms = async ({ where, page, perPage }: { where?: Prisma.UserRoomWhereInput; page?: number; perPage?: number; } = {}) => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.userRoom.findMany({
        where,
        include: {
            room: {
                select: {
                    name: true,
                    uuid: true
                }
            }
        },
        ...paginate
    });
}

export const getUserRoomById = async (id: number): Promise<UserRoom | null> => {
    return await prisma.userRoom.findFirst({ where: { id } });
}

export const getUserRoomByParam = async (params: Prisma.UserRoomWhereInput): Promise<UserRoom | null> => {
    return await prisma.userRoom.findFirst({ where: params });
}

export const createUserRoom = async (userRoom: UserRoom): Promise<UserRoom> => {
    return await prisma.userRoom.create({
        data: userRoom,
    });
}

export const updateUserRoom = async (id: number, userRoom: Partial<UserRoom>): Promise<UserRoom> => {
    return await prisma.userRoom.update({
        where: { id },
        data: userRoom
    });
}

export const deleteUserRoom = async (id: number): Promise<UserRoom> => {
    return await prisma.userRoom.delete({
        where: { id }
    });
}

