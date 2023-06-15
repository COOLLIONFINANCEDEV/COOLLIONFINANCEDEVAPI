import { Prisma, PrismaClient, Invitation } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInvitations = async ({ where, page, perPage }: { where?: Prisma.InvitationWhereInput; page?: number; perPage?: number; } = {}): Promise<Invitation[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.invitation.findMany({
        where,
        ...paginate
    });
}

export const getInvitationById = async (id: number): Promise<Invitation | null> => {
    return await prisma.invitation.findFirst({ where: { id, deleted: false } });
}

export const getInvitationByParam = async (params: Prisma.InvitationWhereInput): Promise<Invitation | null> => {
    return await prisma.invitation.findFirst({ where: params });
}

export const createInvitation = async (invitation: Invitation): Promise<Invitation> => {
    return await prisma.invitation.create({
        data: invitation,
    });
}

export const updateInvitation = async (id: number, invitation: Partial<Invitation>): Promise<Invitation> => {
    return await prisma.invitation.update({
        where: { id },
        data: invitation
    });
}


// Function to get total number of invitation
export const getTotalInvitations = async (where?: Prisma.InvitationWhereInput) => await prisma.invitation.count({ where });


