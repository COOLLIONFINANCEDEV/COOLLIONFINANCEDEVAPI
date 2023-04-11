import { Prisma, Room } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/room.model';

const pagination = appConfig.pagination;

export const getAllRooms = async ({ where, page, perPage }: { where?: Prisma.RoomWhereInput; page?: number; perPage?: number; } = {}): Promise<Room[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllRooms({ where, page, perPage });
}

export const getRoomById = async (id: number): Promise<Room | null> => {
    return await model.getRoomById(id);
}

export const getRoomByTenant = async (tenantId: number): Promise<Room | null> => {
    return await model.getRoomByParam({ tenant: { id: tenantId } });
}

export const getRoomByParam = async (where: Prisma.RoomWhereInput): Promise<Room | null> => {
    return await model.getRoomByParam(where);
}

export const deleteRoom = async (id: number): Promise<Room> => {
    return await model.deleteRoom(id);
}

export const updateRoom = async (id: number, room: Partial<Room>): Promise<Room> => {
    return await model.updateRoom(id, room);
}

export const registerRoom = async (room: Partial<Room>): Promise<Room> => {
    return await model.createRoom(room as Required<Room>);
}
