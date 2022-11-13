import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/auth/services';
import UserService from 'src/apis/users/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import Hasher from 'src/helpers/hasher';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig, twilioConfig } from 'src/config';
import { getEventListeners } from 'events';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import twilio from 'twilio';
import { error_invalid_code, error_invalid_to } from 'src/middlewares/error_twilio';
import { right_user } from 'src/middlewares/authentication';


const service = new Service();
const userService = new UserService();
const twilioClient = twilio(twilioConfig.ACCOUNT_SID, twilioConfig.AUTH_TOKEN, {
    lazyLoading: true,
})


dotenv.config();


// Create and Save a new user
export const signup = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        email: 'not_null, email',
        contact: 'number, optional',
        password: 'not_null, min_length=8, max_length=20',
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }
    data = result.result;
    const password = Hasher.hash(data.password)
    data["password"] = password.hash;
    data["salt"] = password.salt;

    try {
        const insert = await userService.create(data);
        res.send(make_response(false, insert));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        if (process.env.DEBUG) console.log(e);
    }
}


export const signin = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        username: 'not_null, or=[email | number]',
        code_challenge: "not_null",
        code_challenge_method: "not_null",
        password: 'not_null',
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        let user = null;
        let valid = false;

        user = await service.getUser("email", data.username);
        if (!user) user = await service.getUser("contact", data.username);

        if (!error_404(user, res)) return;

        // if (user?.desable) {
        //     res.send(make_response(true, "Account desabled!"));
        //     return;
        // }

        valid = Hasher.validate_hash(data.password, String(user?.password), String(user?.salt));

        if (!valid) {
            res.send(make_response(true, "Incorect credentials !"));
            return;
        }

        const expireIn = user?.desable ? (Date.now() + (3 * 60 * 1000)) : user?.two_fa ? (Date.now() + (3 * 60 * 1000)) : (Date.now() + 78000);
        const scope = user?.desable ? "email_verification" : user?.two_fa ? "2fa" : "access_token";
        const JWTSecret = user?.desable ? String(process.env.JWT_EMAIL_VERIFICATION_SECRET_KEY) : user?.two_fa ? String(process.env.JWT_2FA_SECRET_KEY) : String(process.env.JWT_AUTH_CODE_SECRET_KEY);
        const encryptSecret = user?.desable ? String(process.env.EMAIL_VERIFICATION_ENCRYPT_KEY) : user?.two_fa ? String(process.env.TWO_FA_ENCRYPT_KEY) : String(process.env.AUTH_CODE_ENCRYPT_KEY);

        const token = jwt.sign(
            {
                user_id: user?.id,
                tenant: user?.role_id,
                two_fa: user?.two_fa,
                code_challenge: data.code_challenge,
                code_challenge_method: data.code_challenge_method,
                exp: expireIn,
            },
            JWTSecret
        );

        const authCode = Hasher.encrypt(token, encryptSecret);

        res.send(make_response(false, { authorization_code: authCode, scope: scope }));
    } catch (e) {
        if (!error_404(e, res)) return;
        if (process.env.DEBUG) console.log(e);
    }
}


export const getAccessToken = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        authorization_code: 'not_null',
        code_verifier: "not_null",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.AUTH_CODE_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_AUTH_CODE_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Authorization code expired!"));
                    return;
                }

            const hash = crypto
                .createHash(String(payload.code_challenge_method))
                .update(data.code_verifier)
                .digest('base64url');

            if (hash !== payload.code_challenge) {
                res.status(401).send(make_response(true, "Unauthorized!"));
                return;
            }

            const access_token = jwt.sign(
                {
                    user_id: payload.user_id,
                    tenant: payload.tenant,
                    exp: Date.now() + (30 * 60 * 1000),
                },
                String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
            );

            const refresh_token = jwt.sign(
                {
                    user_id: payload.user_id,
                    tenant: payload.tenant,
                    exp: Date.now() + (24 * 3600 * 1000),
                },
                String(process.env.JWT_REFRESH_TOKEN_SECRET_KEY)
            );

            res.send(make_response(false, {
                token_type: "Bearer",
                access_token: access_token,
                refresh_token: Hasher.encrypt(refresh_token, String(process.env.REFRESH_TOKEN_ENCRYPT_KEY)),
            }));
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
        }
    } catch (e) {
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}


export const refreshAccessToken = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        refresh_token: 'not_null',
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const refresh_token = Hasher.decrypt(data.refresh_token, String(process.env.REFRESH_TOKEN_ENCRYPT_KEY));
        const payload = jwt.verify(refresh_token, String(process.env.JWT_REFRESH_TOKEN_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Token expired!"));
                    return;
                }

            const access_token = jwt.sign(
                {
                    user_id: payload.user_id,
                    tenant: payload.tenant,
                    exp: Date.now() + (30 * 60 * 1000),
                },
                String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
            );

            res.send(make_response(false, {
                token_type: "Bearer",
                access_token: access_token,
                refresh_token: data.refresh_token,
            }));
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
        }
    } catch (e) {
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
};


// Send a  sms: we got user_id and channel like email , sms, voice or totp
export const twoFAVerify = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        channel: 'not_null, like=[email | sms | totp | voice | whatsapp]',
        authorization_code: "not_null",
        code_verifier: "not_null",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.TWO_FA_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_2FA_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Unauthorized!"));
                    return;
                }
            // console.log(payload);


            const hash = crypto
                .createHash(String(payload.code_challenge_method))
                .update(data.code_verifier)
                .digest('base64url');

            if (hash !== payload.code_challenge) {
                res.status(401).send(make_response(true, "Unauthorized!"));
                return;
            }

            const user = await service.retriveUser(Number(payload.user_id));

            if (!error_404(user, res)) return;

            const channel = data.channel;

            const to = channel == "email" ? user?.email : user?.contact;

            await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
                .verifications
                .create({ to: String(to), channel: channel })
                .then(verification => {
                    // console.log(verification.status, verification);
                    const token = jwt.sign(
                        {
                            user_id: payload.user_id,
                            tenant: payload.tenant,
                            to: to,
                            code_challenge: payload.code_challenge,
                            code_challenge_method: payload.code_challenge_method,
                            exp: Date.now() + (10 * 60 * 1000),
                        },
                        String(process.env.JWT_2FA_SECRET_KEY)
                    );

                    const authCode = Hasher.encrypt(token, String(process.env.CHECK_TWO_FA_ENCRYPT_KEY));

                    res.status(200).send(make_response(false, { authorization_code: authCode, scope: "2fa" }));
                })
                .catch(e => {
                    if (!error_invalid_to(res, e)) return;
                    console.log(e);
                });
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
        }
    } catch (e) {
        // if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        // if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}


// Validate token: we got token, user_id
export const twoFACheck = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        code: 'not_null, number',
        authorization_code: "not_null",
        code_verifier: "not_null",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.CHECK_TWO_FA_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_2FA_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Authorization code expired!"));
                    return;
                }

            const hash = crypto
                .createHash(String(payload.code_challenge_method))
                .update(data.code_verifier)
                .digest('base64url');

            if (hash !== payload.code_challenge) {
                res.status(401).send(make_response(true, "Unauthorized! code"));
                return;
            }

            await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
                .verificationChecks
                .create({ to: String(payload.to), code: data.code })
                .then(verificationCheck => {
                    // console.log(verificationCheck.status, verificationCheck);
                    if (verificationCheck.status === "approved") {
                        const access_token = jwt.sign(
                            {
                                user_id: payload.user_id,
                                tenant: payload.tenant,
                                exp: Date.now() + (30 * 60 * 1000),
                            },
                            String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
                        );

                        const refresh_token = jwt.sign(
                            {
                                user_id: payload.user_id,
                                tenant: payload.tenant,
                                exp: Date.now() + (24 * 3600 * 1000),
                            },
                            String(process.env.JWT_REFRESH_TOKEN_SECRET_KEY)
                        );

                        res.send(make_response(false, {
                            token_type: "Bearer",
                            access_token: access_token,
                            refresh_token: Hasher.encrypt(refresh_token, String(process.env.REFRESH_TOKEN_ENCRYPT_KEY)),
                        }));
                    }
                    else res.status(401).send(make_response(true, "Unauthorized! not approved"));
                })
                .catch(e => {
                    if (!error_invalid_code(res, e)) return;
                    if (!error_invalid_to(res, e)) return;
                    console.log(e);

                });
        } else {
            res.status(401).send(make_response(true, "Unauthorized! payload"));
        }

    } catch (e) {
        // if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        // if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(401).send(make_response(true, "Unauthorized! catch"));
        if (process.env.DEBUG) console.log(e);
    }
}


// Send a  sms: we got user_id and channel like email , sms, voice or totp
export const verifyUserInfo = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        channel: 'not_null, like=[email | sms | totp | voice | whatsapp]',
        authorization_code: "not_null, optional",
        code_verifier: "not_null, optional",
        user_id: "not_null, integer, optional",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result

    try {
        const channel = data.channel;
        let newPayload: { [x: string]: any };
        let user = null;

        if (channel === "email") {
            const token = Hasher.decrypt(data.authorization_code, String(process.env.EMAIL_VERIFICATION_ENCRYPT_KEY));
            const payload = jwt.verify(token, String(process.env.JWT_EMAIL_VERIFICATION_SECRET_KEY));
            const resolveScope = async () => {
                const response: {
                    bool: boolean,
                    newPayload: {},
                    user: { email: string, contact: string } | null
                } = { bool: true, newPayload: {}, user: null };

                if (typeof payload !== "string") {
                    if (payload.exp)
                        if (Date.now() >= payload.exp) {
                            res.status(401).send(make_response(true, "Authorization code expired!"));
                            response.bool = false;
                        }
                    // console.log(payload);


                    const hash = crypto
                        .createHash(String(payload.code_challenge_method))
                        .update(data.code_verifier)
                        .digest('base64url');

                    if (hash !== payload.code_challenge) {
                        res.status(401).send(make_response(true, "Unauthorized!"));
                        response.bool = false;
                    }

                    user = await service.retriveUser(Number(payload.user_id));

                    response.newPayload = {
                        user_id: payload.user_id,
                        tenant: payload.tenant,
                        channel: channel,
                        code_challenge: payload.code_challenge,
                        code_challenge_method: payload.code_challenge_method,
                    }
                    response.user = user

                } else {
                    res.status(401).send(make_response(true, "Unauthorized!"));
                    response.bool = false;
                }

                return response;
            }

            const resolver = await resolveScope();

            if (!resolver.bool) return;

            user = resolver.user;
            newPayload = resolver.newPayload;
        } else {
            user = await service.retriveUser(Number(data.user_id));

            newPayload = {
                user_id: data.user_id,
                channel: channel,
            }
        }

        if (!error_404(user, res)) return;

        const to = channel == "email" ? user?.email : user?.contact;
        newPayload["to"] = to;
        newPayload["exp"] = Date.now() + (10 * 60 * 1000),

            await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
                .verifications
                .create({ to: String(to), channel: channel })
                .then(verification => {
                    // console.log(verification.status, verification);
                    const token = jwt.sign(
                        newPayload,
                        String(process.env.JWT_EMAIL_VERIFICATION_SECRET_KEY)
                    );

                    const authCode = Hasher.encrypt(token, String(process.env.EMAIL_VERIFICATION_ENCRYPT_KEY));

                    res.status(200).send(make_response(false, { authorization_code: authCode, scope: "email_verification" }));
                })
                .catch(e => {
                    if (!error_invalid_to(res, e)) return;
                    res.status(500).send(make_response(true, "Internal server error!"))
                    console.log(e);
                });


    } catch (e) {
        // if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        // if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}


// Validate token: we got token, user_id
export const checkVerification = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        code: 'not_null, number',
        authorization_code: "not_null",
        code_verifier: "not_null, optional",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.EMAIL_VERIFICATION_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_EMAIL_VERIFICATION_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Authorization code expired!"));
                    return;
                }

            let response: {} | string;

            if (payload.channel == "email") {
                const hash = crypto
                    .createHash(String(payload.code_challenge_method))
                    .update(data.code_verifier)
                    .digest('base64url');

                if (hash !== payload.code_challenge) {
                    res.status(401).send(make_response(true, "Unauthorized!"));
                    return;
                }

                const access_token = jwt.sign(
                    {
                        user_id: payload.user_id,
                        tenant: payload.tenant,
                        exp: Date.now() + (30 * 60 * 1000),
                    },
                    String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
                );

                const refresh_token = jwt.sign(
                    {
                        user_id: payload.user_id,
                        tenant: payload.tenant,
                        exp: Date.now() + (24 * 3600 * 1000),
                    },
                    String(process.env.JWT_REFRESH_TOKEN_SECRET_KEY)
                );

                response = {
                    token_type: "Bearer",
                    access_token: access_token,
                    refresh_token: Hasher.encrypt(refresh_token, String(process.env.REFRESH_TOKEN_ENCRYPT_KEY)),
                }
            } else response = "Verified!";

            await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
                .verificationChecks
                .create({ to: String(payload.to), code: data.code })
                .then(async verificationCheck => {
                    // console.log(verificationCheck.status, verificationCheck);
                    if (verificationCheck.status === "approved") {
                        const data: any = payload.channel == "email" ? { desable: false } : { contact_verified: true };

                        await userService.update(payload.user_id, data);
                        res.send(make_response(false, response));
                    }
                    else res.status(401).send(make_response(true, "Unauthorized!"));
                })
                .catch(e => {
                    if (!error_invalid_code(res, e)) return;
                    if (!error_invalid_to(res, e)) return;
                    console.log(e);

                });
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
        }

    } catch (e) {
        // if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        // if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}


export const resetPasswordVerify = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        channel: 'not_null, like=[email]',
        email: "not_null",
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result
    console.log(!data.email);
    

    // if (!data.email || !data.contact) {
    //     res.status(400).send(make_response(true, "Email or Contact must be given !"));
    //     return;
    // }


    try {
        const channel = data.channel;
        let user: { id: number } | null;

        if (channel == "email")
            user = await userService.getUser({ email: data.email });
        else
            user = await userService.getUser({ contact: data.contact });

        if (!error_404(user, res)) return;

        const to = channel == "email" ? data.email : data.contact;

        await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
            .verifications
            .create({ to: String(to), channel: channel })
            .then(verification => {
                // console.log(verification.status, verification);
                const token = jwt.sign(
                    {
                        user_id: user?.id,
                        to: to,
                        exp: Date.now() + (10 * 60 * 1000),
                    },
                    String(process.env.JWT_RESET_PASSWORD_SECRET_KEY)
                );

                const authCode = Hasher.encrypt(token, String(process.env.RESET_PASSWORD_ENCRYPT_KEY));

                res.status(200).send(make_response(false, { authorization_code: authCode, scope: "reset_password" }));
            })
            .catch(e => {
                if (!error_invalid_to(res, e)) return;
                // console.log(e);
                res.status(500).send(make_response(true, "Uncknow error!"));
                if (process.env.DEBUG) console.log(e);
            });
    } catch (e) {
        // if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        // if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}


export const resetPasswordReset = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        code: "not_null, number",
        authorization_code: 'not_null',
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.RESET_PASSWORD_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_RESET_PASSWORD_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Authorization code expired!"));
                    return;
                }


            await twilioClient.verify.v2.services(twilioConfig.SERVICE_ID)
                .verificationChecks
                .create({ to: String(payload.to), code: data.code })
                .then(async verificationCheck => {
                    // console.log(verificationCheck.status, verificationCheck);
                    if (verificationCheck.status === "approved") {
                        const newPassword = Hasher.generate_salt(null, 16).hexString;
                        const password = Hasher.hash(newPassword)
                        data["password"] = password.hash;
                        data["salt"] = password.salt;
                        delete data["code"], delete data["authorization_code"];
                        await userService.update(Number(payload.user_id), data);

                        res.send(make_response(false, { password: newPassword }));
                    }
                    else res.status(401).send(make_response(true, "Unauthorized!"));
                })
                .catch(e => {
                    if (!error_invalid_code(res, e)) return;
                    if (!error_invalid_to(res, e)) return;
                    if (process.env.DEBUG) console.log(e);
                });
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
        }
    } catch (e) {
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) console.log(e);
    }
}



