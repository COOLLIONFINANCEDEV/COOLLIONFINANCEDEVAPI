import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/two_fa_code/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import twilio from 'twilio'
import { twilioConfig } from 'src/config';
import { error_invalid_to, error_invalid_code } from 'src/middlewares/error_twilio';
import Hasher from 'src/helpers/hasher';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const service = new Service();
const twilioClient = twilio(twilioConfig.ACCOUNT_SID, twilioConfig.AUTH_TOKEN, {
    lazyLoading: true,
})

// Send a  sms: we got user_id and channel like email , sms, voice or totp
export const send = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        channel: 'not_null, like=[email | sms | totp | voice | whatsapp]',
        authorization_code: "not_null",
        code_verifier: "not_null",
    });

    if (result.error) {
        res.send(result);
        return;
    }

    data = result.result

    try {
        const token = Hasher.decrypt(data.authorization_code, String(process.env.TWO_FA_ENCRYPT_KEY));
        const payload = jwt.verify(token, String(process.env.JWT_2FA_SECRET_KEY));

        if (typeof payload !== "string") {
            if (payload.exp)
                if (Date.now() >= payload.exp) {
                    res.status(401).send(make_response(true, "Authorization code expired!"));
                    return;
                }
            console.log(payload);
            

            const hash = crypto
                .createHash(String(payload.code_challenge_method))
                .update(data.code_verifier)
                .digest('base64url');

            if (hash !== payload.code_challenge) {
                res.status(401).send(make_response(true, "Unauthorized!"));
                return;
            }

            const user = await service.getUser(Number(payload.user_id));

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
        console.log(e);
    }
}


// Validate token: we got token, user_id
export const check = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        code: 'not_null, number',
        authorization_code: "not_null",
        code_verifier: "not_null",
    });

    if (result.error) {
        res.send(result);
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
                res.status(401).send(make_response(true, "Unauthorized!"));
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
        console.log(e);

    }
}



