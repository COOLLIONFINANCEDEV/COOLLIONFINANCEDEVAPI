import { Prisma, PrismaClient, PermissionRole } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPermissionRoles = async (where?: Prisma.PermissionRoleWhereInput): Promise<PermissionRole[]> => {
    return await prisma.permissionRole.findMany({
        where
    });
}

export const getPermissionRoleById = async (id: number): Promise<PermissionRole | null> => {
    return await prisma.permissionRole.findUnique({ where: { id } });
}

export const getPermissionRoleByParam = async (params: Prisma.PermissionRoleWhereInput): Promise<PermissionRole | null> => {
    return await prisma.permissionRole.findFirst({ where: params });
}

export const createPermissionRole = async (permissionRole: PermissionRole): Promise<PermissionRole> => {
    return await prisma.permissionRole.create({
        data: permissionRole,
    });
}

export const updatePermissionRole = async (id: number, permissionRole: Partial<PermissionRole>): Promise<PermissionRole> => {
    return await prisma.permissionRole.update({
        where: { id },
        data: permissionRole
    });
}

export const deletePermissionRoleByPermRole = async (permissionId: number, roleId: number): Promise<PermissionRole> => {
    return await prisma.permissionRole.delete({
        where: {
            permissionId_roleId: {
                permissionId,
                roleId,
            }
        }
    });
}
