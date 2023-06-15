import { Invitation, Prisma } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/invitation.model';

const pagination = appConfig.pagination;

export const getAllInvitations = async ({ where, page, perPage }: { where?: Prisma.InvitationWhereInput; page?: number; perPage?: number; } = {}): Promise<Invitation[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllInvitations({ where, page, perPage });
}

export const getInvitationById = async (id: number): Promise<Invitation | null> => {
    return await model.getInvitationById(id);
}

export const getInvitationByParam = async (where: Prisma.InvitationWhereInput): Promise<Invitation | null> => {
    return await model.getInvitationByParam(where);
}

export const deleteInvitation = async (id: number): Promise<Invitation> => {
    return await model.updateInvitation(id, { deleted: true });
}

export const confirmInvitation = async (id: number, confirmation: boolean): Promise<Invitation> => {
    return await model.updateInvitation(id, { confirm: confirmation, deleted: true });
}

export const registerInvitation = async (invitation: Partial<Invitation>): Promise<Invitation> => {
    return await model.createInvitation(invitation as Required<Invitation>);
}

export const getTotalInvitations = async () => model.getTotalInvitations();

// Function to get the number of invitation sent for one tenant
export const getTotalInvitationsSentByOneTenant = async (tenantId: number) => await model.getTotalInvitations({ sender: tenantId });


