import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/users/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import Hasher from 'src/helpers/hasher';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';
import { getEventListeners } from 'events';
import { users } from '@prisma/client';
import { error_invalid_to } from 'src/middlewares/error_twilio';

const service = new Service();

// const { check_body } = require("../utils/check_body.js");
// import Hasher from "helpers/hasher";
// import Service from 'apis/users/service'

// const Service = new UserServices(undefined, 'user');


// // Create and Save a new user
// export const create = async (req: Request, res: Response) => {
//     // Validate request
//     if (!check_req_body(req, res)) return;

//     let data = req.body;

//     const result = serializer(data, {
//         first_name: 'not_null',
//         last_name: 'not_null',
//         email: 'not_null, email',
//         contact: 'number',
//         password: 'not_null, min_length=8, max_length=20',
//         two_fa: "not_null, boolean",
//         role_id: "not_null, integer",
//     });

//     if (result.error) {
//         res.send(result);
//         return;
//     }
//     const password = Hasher.hash(req.body.password)
//     data = result.result;
//     data["password"] = password.hash;
//     data["salt"] = password.salt;

//     try {
//         const insert = await service.create(data);
//         res.send(make_response(false, insert));
//     } catch (e) {
//         if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
//         if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
//         throw e;
//     }
// }


// Update and Save a new user
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        first_name: 'not_null, optional',
        last_name: 'not_null, optional',
        email: 'not_null, email, optional',
        contact: 'number, optional',
        last_password: 'not_null, min_length=8, max_length=20, optional',
        password: 'not_null, min_length=8, max_length=20, optional',
        two_fa: 'not_null, boolean, optional',
        role_id: 'not_null, integer, optional',
        desable: 'not_null, boolean, optional',
        is_deleted: 'not_null, boolean, optional',
    });

    if (result.error) {
        res.send(result);
        return;
    }

    data = result.result;

    try {
        if (data.password !== undefined) {
            if (data.last_password == undefined) {
                res.status(400).send(make_response(true, "Can not update password without last password"));
                return;
            }

            const user = await service.retrive(Number(id));

            if (!error_404(user, res)) return;

            const valid = Hasher.validate_hash(data.last_password, String(user?.password), String(user?.salt));

            if (!valid) {
                res.send(make_response(true, "Incorrect password!"));
                return;
            }

            const password = Hasher.hash(data.password)
            data["password"] = password.hash;
            data["salt"] = password.salt;
            delete data["last_password"];
        }
        const update = await service.update(Number(id), data);
        res.send(make_response(false, update));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all user from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const users = await service.get({ page: page, perPage: perPage });

    if (!error_404(users, res)) return;

    res.send(make_response(false, users));
};


// Retrive user
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await service.retrive(Number(id));

    if (!error_404(user, res)) return;

    res.send(make_response(false, user));
};


// Soft delete user
export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id) || -1;

    try {
        const user = await service.deleteOne('users', id);
        res.send(make_response(false, user));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge users
export const removeAll = async (req: Request, res: Response) => {
    const user = await service.deleteAll("users");

    res.send(make_response(false, user));
};


