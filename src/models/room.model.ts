import { Prisma, PrismaClient, Room } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRooms = async ({ where, page, perPage }: { where?: Prisma.RoomWhereInput; page?: number; perPage?: number; } = {}): Promise<Room[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.room.findMany({
        where,
        ...paginate
    });
}

export const getRoomById = async (id: number): Promise<Room | null> => {
    return await prisma.room.findFirst({ where: { id } });
}

export const getRoomByParam = async (params: Prisma.RoomWhereInput): Promise<Room | null> => {
    return await prisma.room.findFirst({ where: params });
}

export const createRoom = async (room: Room): Promise<Room> => {
    return await prisma.room.create({
        data: room,
    });
}

export const updateRoom = async (id: number, room: Partial<Room>): Promise<Room> => {
    return await prisma.room.update({
        where: { id },
        data: room
    });
}

export const deleteRoom = async (id: number): Promise<Room> => {
    return await prisma.room.delete({
        where: { id }
    });
}

// Function to get total number of room
export const getTotalRooms = async (where?: Prisma.RoomWhereInput) => await prisma.room.count({ where });

// Function to get the number of room for one tenant
export const getTotalRoomPerUser = async (userId: number) => await prisma.userRoom.count({ where: { userId } });

