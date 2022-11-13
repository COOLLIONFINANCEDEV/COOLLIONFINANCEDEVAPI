import { NextFunction, Response, Request } from "express";
import make_response from "src/helpers/make_response";
import jwt from 'jsonwebtoken';
import BaseService from "src/apis/base_service";
import { Prisma } from "@prisma/client";
import assert from "assert";

function authentication(req: Request, res: Response, next: NextFunction): void {
    try {
        const oauth = req.headers.authorization?.split(" ");
        if (oauth !== undefined) {
            if (oauth[0] !== "Bearer") throw new Error("Authorization is not a Bearer token!");

            const payload = jwt.verify(oauth[1], String(process.env.JWT_ACCESS_TOKEN_SECRET_KEY));

            if (typeof payload !== "string") {
                if (payload.exp)
                    if (Date.now() >= payload.exp) {
                        res.status(401).send(make_response(true, "Unauthorized!"));
                        return;
                    }

                res.locals.auth = {
                    user_id: payload.user_id,
                    tenant: payload.tenant
                };

                next();
            } else {
                res.status(401).send(make_response(true, "Unauthorized!"));
                if (process.env.DEBUG)
                    throw new Error("Token error!");
            }
        } else {
            res.status(401).send(make_response(true, "Unauthorized!"));
            if (process.env.DEBUG)
                throw new Error("Authorization not provided!");
        }
    } catch (e) {
        res.status(401).send(make_response(true, "Unauthorized!"));
        if (process.env.DEBUG) throw e;
    }
}


export function right_user(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const auth = res.locals.auth;

    if (auth?.user_id !== Number(id)) {
        res.status(401).send(make_response(true, "Unauthorized!"));
        return;
    }

    next();
}


export function right_owner({ entity, id, owner, constraint }: { entity: Prisma.ModelName; id?: number | string; owner?: number; constraint?: string; }) {
    const service = new BaseService();

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            owner = owner || res.locals.auth?.user_id;
            const _id = id || req.params.id;

            const isOwner = await service.isOwner(entity, Number(_id), Number(owner), constraint);
            assert(isOwner);
        }
        catch (e) {
            res.status(401).send(make_response(true, "Unauthorized!"));
            return;
        }

        next();
    };
}


export default authentication;

