import { Prisma, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUserRoles = async (where?: Prisma.UserRoleWhereInput) => {
    return await prisma.userRole.findMany({
        where,
        include: {
            roles: {
                include: {
                    permissionRole: {
                        select: {
                            permission: {
                                select: { codename: true }
                            }
                        }
                    }
                }
            }
        }
    });
}

export const getUserRoleById = async (id: number): Promise<UserRole | null> => {
    return await prisma.userRole.findUnique({ where: { id } });
}

export const getUserRoleByParam = async (params: Prisma.UserRoleWhereInput): Promise<UserRole | null> => {
    return await prisma.userRole.findFirst({ where: params });
}

export const createUserRole = async (userRole: UserRole): Promise<UserRole> => {
    return await prisma.userRole.create({
        data: userRole,
    });
}

export const updateUserRole = async (id: number, userRole: Partial<UserRole>): Promise<UserRole> => {
    return await prisma.userRole.update({
        where: { id },
        data: userRole
    });
}

export const deleteUserRoleByPermRole = async (userId: number, roleId: number): Promise<UserRole> => {
    return await prisma.userRole.delete({
        where: {
            userId_roleId: {
                userId,
                roleId,
            }
        }
    });
}
