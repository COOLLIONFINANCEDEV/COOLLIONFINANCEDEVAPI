import { randomUUID } from "crypto";
import debug from "debug";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig } from '../configs/utils.conf';
import { updateUser } from "../models/user.model";
import { getInvitationById } from "../services/invitation.service";
import { getRoleByName } from "../services/role.service";
import { registerRoom } from "../services/room.service";
import { getTenantByParam } from "../services/tenant.service";
import { attributeUserToRole } from "../services/user-role.service";
import { registerUserRoom } from "../services/user-room.service";
import { getUserByEmailOrPhone, getUserById, registerUser } from '../services/user.service';
import { ICustomRequest, TAccountTypesCodename } from "../types/app.type";
import { getAccess } from "../utils/get-access.helper";
import Hasher from '../utils/hasher.helper';
import { jwtErrorHandler } from "../utils/jwt-error.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import { redisClient } from "../utils/redis-client.helper";
import CustomResponse from '../utils/response.helper';
import { sendMagicLink } from "../utils/send-magic-link.helper";

const constants = appConfig.constants;

export const changePassword = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:auth:changePassword');

    try {
        const { oldPassword, newPassword } = req.body;
        const hasher = new Hasher(hasherConfig.hashSecretKey);
        const auth = req.auth!;
        const user = await getUserById(auth.userId);

        const checkPassword = await hasher.verifyPasswordBcrypt(oldPassword, String(user?.password));

        if (!checkPassword) {
            response[401]({
                message: 'Incorrect credentials!',
                errors: [{ field: 'oldPassword', message: 'Invalid old password!' }]
            });
            return;
        }

        const newPasswordHash = await hasher.hashPasswordBcrypt(newPassword);
        await updateUser(auth.userId, { password: newPasswordHash });

        await redisClient.sadd(appConfig.redisKeys.revokedUserSession, auth.userId);
        await redisClient.del(auth.sessionId);

        response.sendResponse({
            message: 'Password was change successfull!',
        }, 201);
    } catch (err) {
        logger(err);
        response[500]({ message: 'An error occurred when changing password' });
    }
};


export const refreshToken = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:auth:refreshToken');

    try {
        const { refreshToken, userId } = req.body;
        const hasher = new Hasher(hasherConfig.hashSecretKey);
        const sessionId = await redisClient.get(refreshToken);

        if (sessionId === null) {
            response[401]({ message: "Session probably expired." });
            return;
        }

        const testSessionId = hasher.hashToken(`${JSON.stringify(req.clientInfo)}${userId}`);

        if (sessionId !== testSessionId) {
            // feat: send a message to the account owner that the session may be compromised
            response[403]({ message: constants.COMPROMISED_SESSION });
            return;
        }

        const isUserRevoked = await redisClient.sismember(appConfig.redisKeys.revokedUserSession, userId);

        if (isUserRevoked === 1) {
            await redisClient.del([refreshToken, String(sessionId)]);
            response[401]({ message: "Session revoked, re login required!" });
            return;
        }

        const session = await redisClient.get(sessionId);

        if (session === null) {
            response[401]({ message: "Session expired." });
            return;
        }

        const oldSession = JSON.parse(session);
        const newRefreshToken = randomUUID();

        const newSession = [newRefreshToken, oldSession[1], oldSession[2]];
        // REDIS - SAVE UPDATED SESSION
        await redisClient.del(refreshToken); // del last refreshToken
        await redisClient.set(sessionId, JSON.stringify(newSession), 'EX', appConfig.sessionExpirationTime);
        await redisClient.set(newRefreshToken, sessionId, "EX", appConfig.sessionExpirationTime);

        const newAccessToken = jwt.sign({
            userId, sessionId, tenants: oldSession[1].map((tenant: number[]) => tenant[0])
        }, appConfig.jwtSecret, { expiresIn: appConfig.tokenExpirationTime });

        response.sendResponse({
            message: 'Access refresh was successful!',
            data: [{ tokenType: "Bearer", accessToken: newAccessToken, refreshToken: newRefreshToken }]
        }, 200);
    } catch (err) {
        logger(err);
        response[500]({ message: 'An error occurred while refreshing the access.' });
    }
};


// export const loginWithWallet = async (req: ICustomRequest, res: Response) => {
//     const response = new CustomResponse(res);
//     const logger = debug('coollionfi:auth:loginWithWallet');

//     try {
//         const { address } = req.body;
//         const hasher = new Hasher(hasherConfig.hashSecretKey);
//         const anonymousUser = {
//             email: `${(address as string).substring(0, 8)}@anonymous.com`,
//             password: `${address}`
//         }
//         let user = await getUserByEmailOrPhone(anonymousUser.email);

//         if (!user) {
//             const hasher = new Hasher(hasherConfig.hashSecretKey);
//             const passwordHash = await hasher.hashPasswordBcrypt(anonymousUser.password);
//             user = await registerUser({ email: anonymousUser.email, password: passwordHash, accountActivated: true });
//         } else {
//             if (!user.accountActivated)
//                 return response.sendResponse({
//                     message: 'Account deactivated! Take look at your emails or contact us for more information about the reason!',
//                 }, 401);

//             const checkPassword = await hasher.verifyPasswordBcrypt(anonymousUser.password, user.password);

//             if (!checkPassword) {
//                 response.sendResponse({
//                     message: 'Incorrect credentials!',
//                     errors: [{ field: 'password', message: 'Invalid password!' }]
//                 }, 401);
//                 return;
//             }
//         }

//         const { refreshToken, accessToken } = await getAccess(req, user.id);

//         response.sendResponse({
//             message: 'Login successful!',
//             data: [{ tokenType: "Bearer", accessToken, refreshToken }]
//         }, 200);
//     } catch (err) {
//         logger(err);
//         response[500]({ message: 'An error occurred while logging in.' });
//     }
// };


export const login = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:auth:login');

    try {
        const { username, password, magicLink, address } = req.body;
        const hasher = new Hasher(hasherConfig.hashSecretKey);
        // let user: User | null = null;
        let refreshToken: string = "";
        let accessToken: string = "null";

        // LOGIN WITH MAGIC LINK
        if (magicLink) {
            const token = Buffer.from(magicLink, "base64url").toString("utf8");
            console.log("token", token);
            const decodedToken = jwt.verify(token, appConfig.jwtSecret);

            if (typeof decodedToken === "string")
                return response[401]({ message: constants.INVALID_TOKEN });

            await updateUser(decodedToken.userId, { emailVerified: true, accountActivated: true });

            const access = await getAccess(req, decodedToken.userId);
            refreshToken = access.refreshToken;
            accessToken = access.accessToken;
        }
        // LOGIN OR REGISTER WITH CRYPTO WALLET ADDRESS
        else if (address) {
            const anonymousUser = {
                email: `${(address as string).substring(0, 8)}@anonymous.com`,
                password: `${address}`
            };
            let user = await getUserByEmailOrPhone(anonymousUser.email);

            if (!user) {
                const userRole = await getRoleByName(appConfig.baseUserRoleName);

                if (userRole === null) {
                    response[500]({
                        message: "Can't set user permissions!",
                    });
                    return;
                }

                const hasher = new Hasher(hasherConfig.hashSecretKey);
                const passwordHash = await hasher.hashPasswordBcrypt(anonymousUser.password);
                user = await registerUser({ email: anonymousUser.email, password: passwordHash, accountActivated: true });

                await attributeUserToRole(user.id, userRole.id);
                logger("Basic access granted for the unknown user!");

                const codename: TAccountTypesCodename = "ADMIN";
                const admin = await getTenantByParam({ accountType: { codename } });

                if (admin) {
                    const room = await registerRoom({ name: admin.name, host: admin.id, uuid: randomUUID() });

                    await registerUserRoom({ userId: user.id, roomId: room.id });
                }
            } else {
                if (!user.accountActivated)
                    return response[401]({
                        message: 'Account deactivated! Take look at your emails or contact us for more information about the reason!',
                    });

                const checkPassword = await hasher.verifyPasswordBcrypt(anonymousUser.password, user.password);

                if (!checkPassword) {
                    response[401]({
                        message: 'Incorrect credentials!',
                        errors: [{ field: 'address', message: 'Invalid address!' }]
                    });
                    return;
                }
            }

            const access = await getAccess(req, user.id);
            refreshToken = access.refreshToken;
            accessToken = access.accessToken;
        }
        // LOGIN WITH USERNAME AND PASSWORD
        else {
            const user = await getUserByEmailOrPhone(username);

            if (!user)
                return response[401]({
                    message: 'Incorrect credentials!',
                    errors: [{ field: 'username', message: 'Account  not found!' }]
                });

            if (!user.accountActivated) {
                // if (user.emailVerified)
                return response[401]({
                    message: 'Account deactivated! Take look at your emails or contact us for more information about the reason!',
                });
                // else await updateUser(user.id, { emailVerified: true, accountActivated: true });
            }

            const parseUsername = (username as string).replace(/ /g, "");

            if ((!isNaN(Number(parseUsername)) && !user.phoneVerified))
                return response[401]({
                    message: 'You cannot log in with your phone number as it is not verified.',
                    errors: [{ field: 'username', message: 'Use email to log in' }]
                });

            const checkPassword = await hasher.verifyPasswordBcrypt(password, user.password);

            if (!checkPassword) {
                response[401]({
                    message: 'Incorrect credentials!',
                    errors: [{ field: 'password', message: 'Invalid password!' }]
                });
                return;
            }

            const access = await getAccess(req, user.id);
            refreshToken = access.refreshToken;
            accessToken = access.accessToken;
        }

        response[200]({
            message: 'Login successful!',
            data: [{ tokenType: "Bearer", accessToken, refreshToken }]
        });
    } catch (err) {
        logger(err);

        const jwtError = jwtErrorHandler(err);

        if (jwtError)
            return response[401]({ message: jwtError });
        response[500]({ message: 'An error occurred while logging in.' });
    }
};


export const register = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:auth:register');

    try {
        const { guest, password } = req.body;
        let { email } = req.body;
        const hasher = new Hasher(hasherConfig.hashSecretKey);
        const userRole = await getRoleByName(appConfig.baseUserRoleName);

        if (userRole === null) {
            response[500]({
                message: "Can't set user permissions!",
            });
            return;
        }

        // REGISTRATION WITH GUEST TOKEN
        if (guest) {
            const token = Buffer.from(guest, "base64url").toString("utf8");
            const decodedToken = jwt.verify(token, appConfig.jwtSecret);

            if (typeof decodedToken === "string")
                return response[400]({ message: constants.INVALID_TOKEN });

            const invitation = await getInvitationById(decodedToken.guest);

            if (!invitation)
                return response[400]({
                    message: "Bad registration credentials!",
                    errors: [{
                        field: "guest",
                        message: constants.INVALID_TOKEN
                    }]
                });

            const hmac = hasher.hashToken(invitation.receiverEmail + String(invitation.sender));

            if (hmac !== decodedToken.hmac)
                return response[401]({
                    message: "Bad registration credentials!",
                    errors: [{
                        field: "guest",
                        message: constants.INVALID_TOKEN
                    }]
                });

            email = invitation.receiverEmail;
        }

        const activation = !guest ? undefined : {
            accountActivated: true,
            emailVerified: true
        };

        const passwordHash = await hasher.hashPasswordBcrypt(password);
        const newUser = await registerUser({ email, password: passwordHash, ...activation });
        logger("New user registered successfully!");

        await attributeUserToRole(newUser.id, userRole.id);
        logger("Basic access granted for the user!");

        await sendMagicLink(newUser.id, email);
        logger("Activation account email sent");

        const codename: TAccountTypesCodename = "ADMIN";
        const admin = await getTenantByParam({ accountType: { codename } });

        if (admin) {
            const room = await registerRoom({ name: admin.name, host: admin.id, uuid: randomUUID() });

            await registerUserRoom({ userId: newUser.id,  roomId: room.id });
        }

        response[201]({ message: "Account created successfully! Please check the magic link in your email box to actvate your account." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            const jwtError = jwtErrorHandler(err);

            if (jwtError)
                return response[401]({ message: jwtError });
            response[500]({ message: "An error occurred while registering." });
        }
    }
};

