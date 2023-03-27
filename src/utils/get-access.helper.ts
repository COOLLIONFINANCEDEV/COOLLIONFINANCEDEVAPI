import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig } from "../configs/utils.conf";
import { getUsersPermissionsByUserId } from "../models/users-permissions.model";
import { getUserTenantByUserId } from "../services/users-tenants.service";
import { ICustomRequest } from "../types/app.type";
import Hasher from "./hasher.helper";
import { redisClient } from "./redis-client.helper";

export const getAccess = async (req: ICustomRequest, userId: number) => {
    const hasher = new Hasher(hasherConfig.hashSecretKey);
    const usersTenants = await getUserTenantByUserId(userId);
    const usersPermissions = await getUsersPermissionsByUserId(userId);
    /**
     * TenantsPermissions
     * 
     * [[tenantId, [permissionCodename, ...]], ...]
     */
    const tenantsPermissions = usersTenants.map(({ tenantId, role }) => {
        const permissions = role.permissionRole.map(({ permission }) => permission.codename);
        return [tenantId, permissions];
    });
    /**
     * UsersPermissions
     * 
     * [permissionId, ...]
     */
    const appPermissions = usersPermissions.map(({ permission }) => permission.codename);
    const sessionId = hasher.hashToken(`${JSON.stringify(req.clientInfo)}${userId}`);
    const refreshToken = randomUUID();
    /**
     * Session format
     * 
     * ["refreshToken", [["tenantId", "roleId"], ...], ["permissionIds"]]
     */
    const newSession = [refreshToken, tenantsPermissions, appPermissions];
    // REDIS - SAVE SESSION
    await redisClient.set(sessionId, JSON.stringify(newSession), 'EX', appConfig.sessionExpirationTime);
    await redisClient.set(refreshToken, sessionId, "EX", appConfig.sessionExpirationTime);
    await redisClient.srem(appConfig.redisKeys.revokedUserSession, userId);

    const accessToken = jwt.sign({
        userId: userId, sessionId, tenants: tenantsPermissions.map(tenant => tenant[0])
    }, appConfig.jwtSecret, { expiresIn: appConfig.tokenExpirationTime });

    return { accessToken, refreshToken };
};
