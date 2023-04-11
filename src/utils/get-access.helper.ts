import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig } from "../configs/utils.conf";
import { getUsersPermissionsByUserId } from "../models/users-permissions.model";
import { getRoomByTenant } from "../services/room.service";
import { getAllUserRooms } from "../services/user-room.service";
import { getUserTenantByUserId } from "../services/users-tenants.service";
import { ICustomRequest } from "../types/app.type";
import Hasher from "./hasher.helper";
import { redisClient } from "./redis-client.helper";

export const getAccess = async (req: ICustomRequest, userId: number) => {
    const hasher = new Hasher(hasherConfig.hashSecretKey);
    const usersTenants = await getUserTenantByUserId(userId);
    const usersPermissions = await getUsersPermissionsByUserId(userId);
    const userRooms = await getAllUserRooms({ where: { userId } });
    const rooms = userRooms.map(({ room }) => room.uuid);
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
     * [permissionCodename, ...]
     */
    const appPermissions = usersPermissions.map(({ permission }) => permission.codename);
    const tenants = tenantsPermissions.map(([tenantId,]) => tenantId as number);

    tenants.forEach(async (tenantId) => {
        const room = await getRoomByTenant(tenantId);
        if (room) rooms.push(room.uuid);
    });

    const sessionId = hasher.hashToken(`${JSON.stringify(req.clientInfo)}${userId}`);
    const refreshToken = randomUUID();
    /**
     * Session format
     * 
     * ["refreshToken", [["tenantId", "roleId"], ...], ["permissionIds"], ["roomIds"]]
     */
    const newSession = [refreshToken, tenantsPermissions, appPermissions, rooms];
    // REDIS - SAVE SESSION
    await redisClient.set(sessionId, JSON.stringify(newSession), 'EX', appConfig.sessionExpirationTime);
    await redisClient.set(refreshToken, sessionId, "EX", appConfig.sessionExpirationTime);
    await redisClient.srem(appConfig.redisKeys.revokedUserSession, userId);

    const accessToken = jwt.sign({
        userId: userId, sessionId, tenants
    }, appConfig.jwtSecret, { expiresIn: appConfig.tokenExpirationTime });

    return { accessToken, refreshToken };
};
