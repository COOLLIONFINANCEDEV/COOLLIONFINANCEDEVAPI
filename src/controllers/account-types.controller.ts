import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { deleteAccountTypeRole, registerAccountTypeRole } from "../services/account-type-role.service";
import { getAccountTypeById, getAllAccountType, registerAccountType, updateAccountType } from "../services/account-type.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:accountType:list');

    try {
        const { can } = req.abilities!
        const accountTypes = await getAllAccountType();
        const filteredAccountTypes = accountTypes.map((item) => {
            const { id, name, codename, description, restricted, createdAt, accountsTypesRoles, accountsTypesPermissions } = item;
            let accountType: Record<string, any> = { id, name, codename, description, createdAt };

            if (can("create", "AccountType")) {
                accountType = {
                    ...accountType,
                    roles: accountsTypesRoles.map(({ role }) => {
                        return {
                            id: role.id,
                            name: role.name,
                            description: role.description,
                        }
                    }),
                    permissions: accountsTypesPermissions.map(({ permission }) => {
                        return {
                            id: permission.id,
                            name: permission.name,
                            codename: permission.codename,
                        }
                    }),
                }
            }

            return accountType;
        });
        const finalAccountTypes = await outItemFromList(filteredAccountTypes);

        response[200]({ data: finalAccountTypes });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:accountType:update');

    try {
        const { accountTypeId } = req.params;
        const { can } = req.abilities!

        if (isNaN(Number(accountTypeId)))
            return response[400]({ message: 'Invalid query parameter accountTypeId.' });

        if (!can("create", "AccountType"))
            return response[403]({ message: "You have no permission to view the information of the seleceed record." });

        const accountType = await getAccountTypeById(Number(accountTypeId));

        if (!accountType)
            return response[404]({ message: "Record not found." });

        const filteredAccountType = await abilitiesFilter({
            subject: "AccountType",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [accountType],
        });
        const finalAccountType = await outItemFromList(filteredAccountType);

        response[200]({ data: finalAccountType });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const update = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:accountType:update');

    try {
        const { accountTypeId } = req.params;
        const { name, description, restricted, excludeRoles, addRoles } = req.body;
        const accountType = await getAccountTypeById(Number(accountTypeId));

        if (isNaN(Number(accountTypeId)))
            return response[400]({ message: 'Invalid query parameter accountTypeId.' });

        if (!accountType)
            return response[404]({ message: "Record to update not found!" });

        await updateAccountType(Number(accountTypeId), { name, description, restricted });

        for (const roleId of excludeRoles)
            await deleteAccountTypeRole(accountType.id, roleId);

        for (const roleId of addRoles)
            await registerAccountTypeRole({ accountTypeId: accountType.id, roleId });

        response[201]({ message: "Account type updated successfully." });
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


export const register = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:accountType:register');

    try {
        const { name, codename, description, restricted, roles } = req.body;
        const { userId, tenantId } = req.auth!;
        const newAccountType = await registerAccountType({ name, codename, description, restricted });

        for (const roleId of roles)
            await registerAccountTypeRole({ accountTypeId: newAccountType.id, roleId });

        logger("New account type registered.");
        response[201]({ message: "Account type registered successfully." });
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
