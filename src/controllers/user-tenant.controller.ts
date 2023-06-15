import debug from "debug";
import { Response } from "express";
import { attributeUserToTenant, deleteUserTenant, getAllUserTenants, getUserTenantByParam } from "../services/users-tenants.service";
import { ICustomRequest } from "../types/app.type";
import { groupBy } from "../utils/group-by.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:userTenant:retriveUser');

    try {
        const { tenantId, userId } = req.auth!;
        const { page, perPage } = req.params;

        const userTenants = await getAllUserTenants({ where: { tenantId }, page: Number(page), perPage: Number(perPage) });
        const groupByUserId = await groupBy(userTenants, (item) => item.userId);
        const finalUserTenants = [...groupByUserId].map(([, userTenants]) => {
            const userRoles = userTenants.map(({ role }) => {
                return {
                    id: role.id,
                    name: role.name,
                    description: role.description,
                    owner: role.owner,
                    published: role.published,
                    createdAt: role.createdAt,
                }
            });

            return {
                userId,
                tenantId,
                roles: userRoles
            }
        });

        response[200]({ data: finalUserTenants });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};

export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:userTenant:retriveUser');

    try {
        const { tenantId, userId } = req.auth!;
        const { memberId } = req.params;

        if (isNaN(Number(memberId)))
            return response[400]({ message: 'Invalid query parameter memberId.' });

        const userTenants = await getAllUserTenants({ where: { userId: Number(memberId), tenantId } });

        if (userTenants.length === 0)
            return response[404]({ message: "Record not found!" });

        const userRoles = userTenants.map(({ role }) => {
            return {
                id: role.id,
                name: role.name,
                description: role.description,
                owner: role.owner,
                published: role.published,
                createdAt: role.createdAt,
            }
        });

        response[200]({
            data: [{
                userId,
                tenantId,
                roles: userRoles
            }]
        });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const removeMemberRole = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:userTenant:deleteMember');

    try {
        const { tenantId } = req.auth!;
        const { memberId, roleId } = req.params;

        if (isNaN(Number(memberId)))
            return response[400]({ message: 'Invalid query parameter memberId.' });

        if (isNaN(Number(roleId)))
            return response[400]({ message: 'Invalid query parameter roleId.' });

        const userTenant = await getUserTenantByParam({ userId: Number(memberId), tenantId, roleId: Number(roleId) });

        if (!userTenant)
            return response[404]({ message: "The record to delete not found!" });

        await deleteUserTenant(userTenant.id);
        response[204]({ message: 'Successfully deleted.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0 && errors[0].field === "RecordNotFound") {
            response[404]({ message: "The record to delete not found!" });
        } else {
            logger(err);
            response[500]({ message: "An error occurred while deleting information." });
        }
    }
};


export const removeMember = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:userTenant:deleteUser');

    try {
        const { tenantId } = req.auth!;
        const { memberId } = req.params;

        if (isNaN(Number(memberId)))
            return response[400]({ message: 'Invalid query parameter memberId.' });

        const userTenants = await getAllUserTenants({ where: { userId: Number(memberId), tenantId } });

        if (userTenants.length === 0)
            return response[404]({ message: "The record to delete not found!" });

        for (const { id } of userTenants)
            await deleteUserTenant(id);

        response[204]({ message: 'Successfully deleted.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0 && errors[0].field === "RecordNotFound") {
            response[404]({ message: "The record to delete not found!" });
        } else {
            logger(err);
            response[500]({ message: "An error occurred while deleting information." });
        }
    }
};


export const grantRole = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:userTenant:grantRole');

    try {
        const { tenantId, userId } = req.auth!;
        const { memberId, roles } = req.body;

        if (Number(memberId) === userId)
            return response[403]({ message: "You can’t give yourself a role." });

        const member = await getAllUserTenants({ where: { userId: Number(memberId), tenantId } });

        if (member.length === 0)
            return response[404]({ message: "Member not found! Please invite member to join your organisation." });

        const finalRoles: number[] = [];

        for (const { role } of member)
            if (!roles.includes(role.id)) finalRoles.push(role.id);

        for (const roleId of finalRoles)
            await attributeUserToTenant({ userId: memberId, tenantId, userTenantId: member[0].userTenantId, roleId });

        response[201]({ message: "Roles successfully granted." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred when assigning roles to members." });
        }
    }
}
