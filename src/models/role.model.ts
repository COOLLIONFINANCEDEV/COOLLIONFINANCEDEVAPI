import { Prisma, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRoles = async ({ where, page, perPage }: { where?: Prisma.RoleWhereInput; page?: number; perPage?: number; } = {}): Promise<Role[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;
    return await prisma.role.findMany({
        where,
        ...paginate
    });
}

export const getRoleById = async (id: number): Promise<Role | null> => {
    return await prisma.role.findUnique({ where: { id } });
}

export const getRoleByParam = async (params: Prisma.RoleWhereInput): Promise<Role | null> => {
    return await prisma.role.findFirst({ where: params });
}

export const createRole = async (role: Role): Promise<Role> => {
    return await prisma.role.create({
        data: role,
    });
}

export const updateRole = async (id: number, role: Partial<Role>): Promise<Role> => {
    return await prisma.role.update({
        where: { id },
        data: role
    });
}

export const deleteRole = async (roleId: number): Promise<Role> => {
    return await prisma.role.delete({ where: { id: roleId } });
}
