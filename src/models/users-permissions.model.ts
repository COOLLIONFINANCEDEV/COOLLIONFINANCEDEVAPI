import { Prisma, PrismaClient, UsersPermissions } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersPermissionsByUserId = async (id: number) => {
    return await prisma.usersPermissions.findMany({
        where: { userId: id },
        select: {
            permission: { select: { codename: true } }
        }
    });
}


export const getAllUsersPermissions = async (): Promise<UsersPermissions[]> => {
    return await prisma.usersPermissions.findMany();
}

export const getUsersPermissionsById = async (id: number): Promise<UsersPermissions | null> => {
    return await prisma.usersPermissions.findUnique({ where: { id } });
}

export const getUsersPermissionsByParam = async (params: Prisma.UsersPermissionsWhereInput): Promise<UsersPermissions | null> => {
    return await prisma.usersPermissions.findFirst({ where: params });
}

export const createUsersPermissions = async (usersPermissions: UsersPermissions): Promise<UsersPermissions> => {
    return await prisma.usersPermissions.create({
        data: usersPermissions,
    });
}

export const updateUsersPermissions = async (id: number, usersPermissions: Partial<UsersPermissions>): Promise<UsersPermissions> => {
    return await prisma.usersPermissions.update({
        where: { id },
        data: usersPermissions
    });
}
