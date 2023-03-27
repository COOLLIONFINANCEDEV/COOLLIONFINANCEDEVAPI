import { Role } from "@prisma/client";
import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { attributePermissionToRole, deletePermissionRoleByPermRole } from "../services/permission-role.service";
import { deleteRole, getAllRoles, getRoleById, getRoleByParam, registerRole, updateRole } from "../services/role.service";
import { getTenantById } from "../services/tenant.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import { getUserTenantByParam, getUserTenantByUserId } from "../services/users-tenants.service";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:role:list');

    try {
        const { tenantId, userId } = req.auth!;
        const { page, perPage } = req.params;
        let roles: Role[] = [];
        const { can } = req.abilities!;

        if (can("manage", "Role")) {
            roles = await getAllRoles({ page: Number(page), perPage: Number(perPage) });
        } else {
            const tenant = await getTenantById(tenantId);

            if (!tenant)
                return response[404]({ message: "The record to read not found!" });

            roles = await getAllRoles({
                where: {
                    usersTenants: {
                        some: { userId, tenantId }
                    },
                    OR: [
                        { owner: tenantId },
                        { published: true }
                    ]
                },
                page: Number(page), perPage: Number(perPage)
            });
        }

        const filteredRoles = await abilitiesFilter({
            subject: "Role",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: roles,
            selfInput: false
        }, ({ subject, action, abilities, input }) => {
            const filteredInput = input.map((role) => {
                const filteredValue: Record<string, any> = {};

                Object.keys(role).forEach((item) => {
                    if (abilities.can(action!, subject, role.owner === tenantId ? item : `${item}Other`))
                        filteredValue[item] = role[item as keyof Role];
                });

                return filteredValue as Role;
            });

            return filteredInput;
        });
        const finalRoles = await outItemFromList(filteredRoles);

        response[200]({ data: finalRoles });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:role:retrive');

    try {
        const { tenantId } = req.auth!;
        const { roleId } = req.params;

        if (isNaN(Number(roleId)))
            return response[400]({ message: 'Invalid query parameter roleId.' });


        let role: Role | null = null;
        const { can } = req.abilities!;


        if (can("manage", "Role")) {
            role = await getRoleById(Number(roleId));
        } else {
            const tenant = await getTenantById(tenantId);

            if (!tenant)
                return response[404]({ message: "The record to read not found!" });

            role = await getRoleByParam({
                id: Number(roleId),
                accountsTypesRoles: {
                    some: {
                        accountTypeId: tenant.accountTypeId
                    }
                }
            });
        }

        if (!role)
            return response[404]({ message: "Record not found!" });

        const testOwner = role.owner !== tenantId;

        if (testOwner && !role.published)
            return response[403]({ message: "You do not have permission to view the selected record information." });

        const filteredRole = await abilitiesFilter({
            subject: "Role",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [role],
            selfInput: testOwner ? false : true
        });
        const finalRole = await outItemFromList(filteredRole);

        response[200]({ data: finalRole });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:role:delete');

    try {
        const { tenantId } = req.auth!;
        const { roleId } = req.params;

        if (isNaN(Number(roleId)))
            return response[400]({ message: 'Invalid query parameter roleId.' });

        const role = await getRoleById(Number(roleId));

        if (!role)
            return response[404]({ message: "The record to delete not found!" });

        if (role.owner !== tenantId)
            return response[403]({ message: "You do not have permission to delete the selected record!" });

        await deleteRole(Number(roleId));
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
    const logger = debug('coollionfi:role:update');

    try {
        const { tenantId } = req.auth!;
        const { roleId } = req.params;
        const { name, description, published, newPermissions, removePermissions } = req.body;

        if (isNaN(Number(roleId)))
            return response[400]({ message: 'Invalid query parameter roleId.' });

        const role = await getRoleById(Number(roleId));

        if (!role)
            return response[404]({ message: "The record to update not found!" });

        if (role.owner !== tenantId)
            return response[403]({ message: "You do not have permission to update the selected record!" });

        for (const permissionId of newPermissions)
            await attributePermissionToRole(permissionId, role.id);

        for (const permissionId of removePermissions)
            await deletePermissionRoleByPermRole(permissionId, role.id);

        await updateRole(role.id, { name, description, published });
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
    const logger = debug('coollionfi:role:register');

    try {
        const { name, description, published, permissions } = req.body;
        const { userId, tenantId } = req.auth!;

        const newRole = await registerRole({ name, description, published, owner: tenantId });
        logger(`New role registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        for (const permissionId of permissions)
            await attributePermissionToRole(permissionId, newRole.id);

        logger("Permissions attribute to role: ");
        response[201]({ message: "Role registered successfully." });
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
