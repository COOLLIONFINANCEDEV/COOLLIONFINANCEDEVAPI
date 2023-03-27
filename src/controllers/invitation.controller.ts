import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { twilio } from "../configs/utils.conf";
import { getAccountTypeById } from "../models/account-type.model";
import { confirmInvitation, deleteInvitation, getAllInvitations, getInvitationById, getInvitationByParam, registerInvitation } from "../services/invitation.service";
import { getTenantById } from "../services/tenant.service";
import { getUserByEmailOrPhone, getUserById } from "../services/user.service";
import { attributeUserToTenant } from "../services/users-tenants.service";
import { ICustomRequest } from "../types/app.type";
import { TSGMailData } from "../types/utils.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import sgSendEmail from "../utils/send-email.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:invitation:list');

    try {
        const { tenantId, userId } = req.auth!;
        const { page, perPage } = req.params;
        const user = await getUserById(userId);

        if (!user)
            return response[404]({ message: "Logged in user not found." });

        const invitationsSent = await getAllInvitations({
            where: { sender: tenantId, deleted: false },
            page: Number(page), perPage: Number(perPage)
        });
        const filteredInvitationsSent = await abilitiesFilter({
            subject: "Invitation",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: invitationsSent,
            selfInput: false
        });
        const filteredReceivedInvitations = await abilitiesFilter({
            subject: "Invitation",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: invitationsSent,
            selfInput: false
        });
        const finalInvitationsSent = await outItemFromList(filteredInvitationsSent);
        const finalReceivedInvitations = await outItemFromList(filteredReceivedInvitations);

        response[200]({
            data: [{
                sent: finalInvitationsSent,
                received: finalReceivedInvitations
            }]
        });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:invitation:delete');

    try {
        const { tenantId } = req.auth!;
        const { invitationId } = req.params;

        if (isNaN(Number(invitationId)))
            return response[400]({ message: 'Invalid query parameter invitationId.' });

        const invitation = await getInvitationById(Number(invitationId));

        if (!invitation)
            return response[404]({ message: "The record to delete not found!" });

        if (invitation.sender !== tenantId)
            return response[403]({ message: "You do not have permission to delete the selected record!" });

        await deleteInvitation(Number(invitationId));
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


export const confirm = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:invitation:confirm');

    try {
        const { userId, tenantId } = req.auth!;
        const { confirmation, invitationId } = req.body;
        const user = await getUserById(userId);

        if (!user)
            return response[404]({ message: "No user!" });

        const invitation = await getInvitationByParam({ id: invitationId, receiverEmail: user.email });

        if (!invitation)
            return response[404]({ message: "Invitation not found!" });

        const hostTenant = await getTenantById(invitation.sender);

        if (!hostTenant)
            return response[404]({ message: "Invitation sender not found!" });

        const hostTenantAccountType = await getAccountTypeById(hostTenant.accountTypeId);

        if (!hostTenantAccountType)
            return response[404]({ message: "Can't determine invitation sender account type!" });

        if (!req.abilities?.can("create", "Tenant", `withAccountType${hostTenantAccountType.codename}`, { ignore: true }))
            return response[403]({ message: `You must have an ${hostTenantAccountType.name} account to respond to the invitation.` });

        await attributeUserToTenant({
            userId,
            tenantId: invitation.sender,
            userTenantId: tenantId,
            roleId: invitation.roleId,
            manager: false,
        });
        await confirmInvitation(invitationId, confirmation);

        // feat: record a message for the sender of the invitation indicating 
        // that the user confirms the invitation if it is accepted

        logger(`Invitation confirmed. creator: ${userId}`);

        response[201]({ message: "Invitation(s) sent successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while sending invitation(s)." });
        }
    }
};


export const invite = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:invitation:invite');

    try {
        const { userId, tenantId } = req.auth!;
        const { emails } = req.body;
        const nonRegisteredEmails = new Set<TSGMailData>();

        const tenant = await getTenantById(tenantId);

        if (!tenant)
            return response[404]({ message: "No tenant!" });

        for (const { email, roleId } of emails) {
            const user = await getUserByEmailOrPhone(email);

            if (!user) nonRegisteredEmails.add({
                to: email,
                templateId: twilio.templateIDs.invitation,
                dynamicTemplateData: { sender: tenant.name }
            });

            await registerInvitation({
                sender: tenantId,
                receiverEmail: email,
                roleId
            });
        }

        await sgSendEmail(...[...nonRegisteredEmails]);
        logger(`New invitation(s) sent successfully. Sender:  ${tenantId}, creator: ${userId}`);

        response[201]({ message: "Invitation(s) sent successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while sending invitation(s)." });
        }
    }
};


