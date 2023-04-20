import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { getAccountTypeById } from "../models/account-type.model";
import { getAllAccountTypeRole } from "../services/account-type-role.service";
import { getAllTenants, getTenantById, registerTenant, updateTenant } from "../services/tenant.service";
import { attributeUserToTenant } from "../services/users-tenants.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import { registerRoom } from "../services/room.service";
import { randomUUID } from "crypto";
import { registerUserRoom } from "../services/user-room.service";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:list');

    try {
        const { tenantId } = req.auth!;
        const { page, perPage } = req.params;
        const tenants = await getAllTenants({ where: { id: { not: tenantId }, deleted: false }, page: Number(page), perPage: Number(perPage) });
        const filteredTenants = await abilitiesFilter({
            subject: "Tenant",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: tenants,
            selfInput: false
        });
        const finalTenants = await outItemFromList(filteredTenants);

        response[200]({ data: finalTenants });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retriveOther = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:retriveOther');

    try {
        const { tenantId } = req.auth!;
        const { otherId } = req.params;

        if (isNaN(Number(otherId)))
            return response[400]({ message: 'Invalid query parameter tenantId.' });

        const tenant = await getTenantById(Number(otherId));

        if (!tenant)
            return response[404]({ message: "The record to read not found!" });

        const filteredTenant = await abilitiesFilter({
            subject: "Tenant",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [tenant],
            selfInput: tenantId === Number(otherId) ? true : false
        });
        const finalTenant = await outItemFromList(filteredTenant);

        response[200]({ data: finalTenant });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:retrive');

    try {
        const { tenantId } = req.auth!;
        const tenant = await getTenantById(tenantId);

        if (!tenant)
            return response[404]({ message: "The record to read not found!" });

        const filteredTenant = await abilitiesFilter({
            subject: "Tenant",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [tenant]
        });
        const finalTenant = await outItemFromList(filteredTenant);

        response[200]({ data: finalTenant });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:delete');

    try {
        const { tenantId } = req.auth!;

        await updateTenant(tenantId, { deleted: true });
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


export const update = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:update');

    try {
        const { tenantId } = req.auth!;

        await updateTenant(tenantId, req.body);
        response[200]({ message: 'Informations updated successfully.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while updating information." });
        }
    }
};


export const register = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:tenant:register');

    try {
        const { accountTypeId } = req.body;
        const { userId, tenantId } = req.auth!;
        const accountType = await getAccountTypeById(accountTypeId);

        if (!accountType)
            return response[404]({ message: "Account type not found" });

        const accountTypesRoles = await getAllAccountTypeRole({ accountTypeId });

        if (accountTypesRoles.length === 0) {
            return response[500]({
                message: "Invalid account type!",
                errors: [{
                    field: "accountType",
                    message: "Can't set manager for this account type"
                }]
            });
        }

        if (!req.abilities?.can("create", "Tenant", `withAccountType${accountType.codename}`, { ignore: true }))
            return response[403]({ message: "You have no permission to create tenant with this account type." });

        const newTenant = await registerTenant(req.body);
        logger("New tenant registered successfully by user" + userId);
        
        response[201]({ message: "Tenant registered successfully." });

        for (const accountTypeRole of accountTypesRoles)
            await attributeUserToTenant({
                userId,
                tenantId: newTenant.id,
                userTenantId: tenantId > 0 ? tenantId : undefined,
                roleId: accountTypeRole.roleId,
                manager: true
            });

        logger("User set as tenant manager");

        await registerRoom({ name: newTenant.name, host: newTenant.id, uuid: randomUUID() });

    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while registering the tenant." });
        }
    }
};


