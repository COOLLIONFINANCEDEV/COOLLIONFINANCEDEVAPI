import { NextFunction, Response, Request } from "express";
import make_response from "src/helpers/make_response";
import jwt from 'jsonwebtoken';

function authentication(req: Request, res: Response, next: NextFunction) {
    try {
        const oauth = req.headers.authorization?.split(" ");
        if (oauth !== undefined) {
            if (oauth[0] !== "Bearer") throw new Error("Authorization is not a Bearer token!");

            const payload = jwt.verify(oauth[1], String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY));

            if (typeof payload !== "string") {
                if (payload.exp)
                    if (Date.now() >= payload.exp) {
                        res.status(401).send(make_response(true, "Authorization code expired!"));
                        return;
                    }

                res.locals.auth = {
                    user_id: payload.user_id,
                    tenant: payload.tenant
                };

                next();
            } else throw new Error("Token error!");
        } else throw new Error("Authorization not provided!");
    } catch (e) {
        console.error(e);
        res.status(401).send(make_response(true, "Unauthorized!"));
    }
}

export default authentication;

