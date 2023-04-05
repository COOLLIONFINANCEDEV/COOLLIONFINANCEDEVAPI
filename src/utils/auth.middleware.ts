import debug from "debug";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { loadPermissionsForUser } from "../abilities/main.ability";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig } from "../configs/utils.conf";
import { ICASL, ICustomRequest } from "../types/app.type";
import Hasher from "./hasher.helper";
import { redisClient } from "./redis-client.helper";
import CustomResponse from "./response.helper";
import { jwtErrorHandler } from "./jwt-error.helper";


// const INVALID_TENANT = "Access denied for the tenant";
const constants = appConfig.constants;

export const authenticate = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const response = new CustomResponse(res);
    const hasher = new Hasher(hasherConfig.hashSecretKey);
    const authHeader = req.headers.authorization;
    const logger = debug("coollionfi:middleware:auth:authenticate");

    if (!authHeader)
        return response[401]({ message: constants.AUTH_HEADER_MISSED });

    const [bearer, token] = authHeader.split(" ");

    if (!bearer || !token || bearer !== 'Bearer')
        return response[401]({ message: constants.ERR_BEARER_TOKEN });

    try {
        const decodedToken = jwt.verify(token, appConfig.jwtSecret);

        if (typeof decodedToken === "string")
            return response[401]({ message: constants.INVALID_TOKEN });

        const testSessionId = hasher.hashToken(`${JSON.stringify(req.clientInfo)}${decodedToken.userId}`);

        if (decodedToken.sessionId !== testSessionId) {
            // feat: send a message to the account owner that the session may be compromised
            return response[403]({ message: constants.COMPROMISED_SESSION });
        }

        const isUserRevoked = await redisClient.sismember(appConfig.redisKeys.revokedUserSession, decodedToken.userId);

        if (isUserRevoked === 1)
            return response[401]({ message: constants.ERR_REVOKED_SESSION });

        const session = await redisClient.get(decodedToken.sessionId);

        if (session === null)
            return response[401]({ message: constants.EXP_SESSION });

        let tenantId = Number(req.params.tenantId);

        if (isNaN(tenantId)) tenantId = Math.floor(Math.random() * -1000);

        // if (!decodedToken.tenants.includes(tenantId))
        //     return response[403]({ message: INVALID_TENANT });

        // user:id:tenant:id
        const authKey = `user:${decodedToken.userId}:tenant:${tenantId}`;
        const auth = await redisClient.get(authKey);

        if (auth !== null) req.auth = JSON.parse(auth);
        else {
            const parsedSession = JSON.parse(session);
            const tenantsPermissions: (number | string[])[][] = parsedSession[1];
            const userPermissions: string[] = parsedSession[2];
            const rooms: string[] = parsedSession[3];
            const actualTenantPermissions = tenantsPermissions.filter(([tenant,]) => tenant === tenantId);
            const tenantPermissions = new Set<string>();

            actualTenantPermissions.forEach(([, permissions]) => {
                for (const permission of permissions as string[])
                    tenantPermissions.add(permission);
            });

            req.auth = {
                userId: decodedToken.userId,
                tenantId,
                sessionId: decodedToken.sessionId,
                tenantPermissions: [...tenantPermissions],
                userPermissions,
                rooms
            };

            await redisClient.set(authKey, JSON.stringify(req.auth), "EX", 2.5 * 60);
        }

        next();
    } catch (err) {
        logger(err);

        const jwtError = jwtErrorHandler(err);

        if (jwtError)
            return response[401]({ message: jwtError });
        response[401]({ message: constants.INVALID_TOKEN });
    }
};


export const authorize = (authorizationRules?: ICASL.CustomRawRule[]) => {
    return async (req: ICustomRequest, res: Response, next: NextFunction) => {
        const response = new CustomResponse(res);
        const logger = debug("coollionfi:middleware:auth:authorize");

        if (authorizationRules === undefined) throw new Error(`${constants.ERR_AUTH_RULES}`);

        try {
            req.abilities = loadPermissionsForUser(req.auth);
            const { can } = req.abilities;
            let checker = true;
            const bodyFields = Object.keys(req.body);

            for (let { action, subject, fields, mainRule } of authorizationRules) {
                action = action as ICASL.Action;
                subject = subject as ICASL.Subjects;

                const bool = typeof fields === "string" && (Boolean(mainRule) ? bodyFields.includes(fields) : true);

                if (bool || typeof fields === "undefined") {
                    fields = fields as (string | undefined);
                    checker = can(action, subject, fields);

                    if (!checker) {
                        let fieldToCheck = constants.ANY_FIELD;

                        if (fields && fields !== "")
                            if (fields.substring(fields.lastIndexOf("O")) === "Other")
                                fieldToCheck = fields.substring(0, fields.lastIndexOf("O"));

                        response[403]({
                            message: constants.ACCESS_DENIED,
                            errors: [{
                                field: fieldToCheck,
                                message: `You have not authorized to ${action} the following field of subject ${subject}: ${fieldToCheck}`
                            }]
                        });
                        return;
                    }
                } else {
                    for (const field of fields) {
                        const bool = Boolean(mainRule) ? bodyFields.includes(field) : true;

                        if (bool) {
                            checker = can(action, subject, field);

                            if (!checker) {
                                let fieldToCheck = constants.ANY_FIELD;

                                if (field && field !== "")
                                    if (field.substring(field.lastIndexOf("O")) === "Other")
                                        fieldToCheck = field.substring(0, field.lastIndexOf("O"));
                                response[403]({
                                    message: constants.ACCESS_DENIED,
                                    errors: [{
                                        field: fieldToCheck,
                                        message: `You have not authorized to ${action} the following field of subject ${subject}: ${fieldToCheck}`
                                    }]
                                });
                                return;
                            }
                        }
                    }
                }

                if (!checker) return;
            }

            if (checker) next(); else return;
        } catch (err) {
            logger(err);
            return response[403]({ message: "An error occurred while checking authorization." });
        }
    };
};


// export const socketAuthenticate = async(socket: So, next) => {
    
// }
