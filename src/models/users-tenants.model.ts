import { Prisma, PrismaClient, UserTenant } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUserTenants = async ({ where, page, perPage }: { where?: Prisma.UserTenantWhereInput; page?: number; perPage?: number; } = {}) => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.userTenant.findMany({
        where,
        include: {
            role: {
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
        },
        ...paginate
    });
}

export const getUserTenantById = async (id: number) => {
    return await prisma.userTenant.findFirst({
        where: { id },
        include: {
            role: {
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

export const getUserTenantByParam = async (params: Prisma.UserTenantWhereInput) => {
    return await prisma.userTenant.findFirst({
        where: params,
        include: {
            role: {
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

export const createUserTenant = async (userTenant: UserTenant): Promise<UserTenant> => {
    return await prisma.userTenant.create({
        data: userTenant,
    });
}

export const updateUserTenant = async (id: number, userTenant: Partial<UserTenant>): Promise<UserTenant> => {
    return await prisma.userTenant.update({
        where: { id },
        data: userTenant
    });
}

export const deleteUserTenant = async (id: number) => {
    return await prisma.userTenant.delete({
        where: { id },
    });
} 
