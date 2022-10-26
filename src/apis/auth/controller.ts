import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/auth/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import Hasher from 'src/helpers/hasher';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';
import { getEventListeners } from 'events';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const service = new Service();

export const login = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        email: 'not_null, email, optional',
        contact: 'number, optional',
        code_challenge: "not_null",
        code_challenge_method: "not_null",
        password: 'not_null',
    });

    if (result.error) {
        res.send(result);
        return;
    }

    data = result.result;

    try {
        let user = null;
        let valid = false;

        if (data.email !== undefined) user = await service.getUser("email", data.email);
        else user = await service.getUser("contact", data.contact);

        if (!error_404(user, res)) return;

        valid = Hasher.validate_hash(data.password, String(user?.password), String(user?.salt));

        if (!valid) {
            res.send(make_response(true, "Incorect credentials !"));
            return;
        }

        const expireIn = user?.two_fa ? (Date.now() + (3 * 60 * 1000)) : (Date.now() + 78000);
        const scope = user?.two_fa ? "2fa" : "access_token";
        const JWTSecret = user?.two_fa ? String(process.env.JWT_2FA_SECRET_KEY) : String(process.env.JWT_AUTH_CODE_SECRET_KEY);
        const encryptSecret = user?.two_fa ? String(process.env.TWO_FA_ENCRYPT_KEY) : String(process.env.AUTH_CODE_ENCRYPT_KEY);

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
        throw e;
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
        res.send(result);
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
        res.send(result);
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
    }
};


