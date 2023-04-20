import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async ({ where, page, perPage }: { where: Prisma.UserWhereInput; page: number; perPage: number; }): Promise<User[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.user.findMany({
        where,
        ...paginate
    });
}

export const getUserById = async (id: number): Promise<User | null> => {
    return await prisma.user.findFirst({ where: { id, deleted: false } });
}

export const getUserByParam = async (params: Prisma.UserWhereInput): Promise<User | null> => {
    return await prisma.user.findFirst({ where: params });
}

export const createUser = async (user: User): Promise<User> => {
    return await prisma.user.create({
        data: user,
    });
}

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: user
    });
}

// Function to get total number of user
export const getTotalUsers = async (where?: Prisma.UserWhereInput) => await prisma.user.count({ where });

// Function to get the number of tenant  
export const getUserNumberforOneUser = async (userId: number) => {
    const userTenants = await prisma.userTenant.groupBy({
        by: ['tenantId'],
        where: { userId }
    });

    return userTenants.length;
};

// Function to get the number of room for one tenant
export const getTotalRoomPerUser = async (userId: number) => await prisma.userRoom.count({ where: { userId } });
