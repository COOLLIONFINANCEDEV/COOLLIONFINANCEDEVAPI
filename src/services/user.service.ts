import { Prisma, User } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/user.model';

const pagination = appConfig.pagination;

export const getAllUsers = async ({ where, page, perPage }: { where: Prisma.UserWhereInput; page: number; perPage: number; }): Promise<User[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;

    return await model.getAllUsers({ where, page, perPage });
}

export const getUserById = async (id: number): Promise<User | null> => {
    return await model.getUserById(id);
}

export const getUserByEmailOrPhone = async (username: string): Promise<User | null> => {
    return await model.getUserByParam({
        deleted: false,
        OR: [
            { email: username },
            { phone: username }
        ]
    });
}

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    return await model.updateUser(id, user);
}

export const deleteUser = async (id: number): Promise<User> => {
    return await model.updateUser(id, { deleted: true });
}

export const registerUser = async (user: Partial<User>): Promise<User> => {
    return await model.createUser(user as Required<User>);
}


// Function to get total number of user
export const getTotalUsers = async () => await model.getTotalUsers();

// Function to get the number of tenant  
export const getUserNumberforOneUser = async (userId: number) => await model.getUserNumberforOneUser(userId);
