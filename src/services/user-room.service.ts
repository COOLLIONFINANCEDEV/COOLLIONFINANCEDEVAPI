import { Prisma, UserRoom } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/user-room.model';

const pagination = appConfig.pagination;

export const getAllUserRooms = async ({ where, page, perPage }: { where?: Prisma.UserRoomWhereInput; page?: number; perPage?: number; } = {}) => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllUserRooms({ where, page, perPage });
}

export const getUserRoomById = async (id: number): Promise<UserRoom | null> => {
    return await model.getUserRoomById(id);
}

export const getUserRoomByParam = async (where: Prisma.UserRoomWhereInput): Promise<UserRoom | null> => {
    return await model.getUserRoomByParam(where);
}

export const deleteUserRoom = async (id: number): Promise<UserRoom> => {
    return await model.deleteUserRoom(id);
}

export const updateUserRoom = async (id: number, userRoom: Partial<UserRoom>): Promise<UserRoom> => {
    return await model.updateUserRoom(id, userRoom);
}

export const registerUserRoom = async (userRoom: Partial<UserRoom>): Promise<UserRoom> => {
    return await model.createUserRoom(userRoom as Required<UserRoom>);
}
