import { Request, Response } from 'express';

import Service from 'src/apis/users_docs/services';
import { paginationConfig } from 'src/config';
import check_req_body from 'src/helpers/check_req_body';
import make_response from 'src/helpers/make_response';
import serializer from 'src/middlewares/data_serializer';
import error_404 from 'src/middlewares/error_404';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import validator from 'validator';

const service = new Service();


// Create and Save a new user docs
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null',
        path: 'not_null',
        user_id: "not_null, integer",
    });

    if (result.error) {
        res.send(result);
        return;
    }

    try {
        const insert = await service.create(data);
        res.status(201).send(make_response(false, insert));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        throw e;
    }
}


// Update and Save a new user docs
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null, optional',
        path: 'not_null, optional',
        is_deleted: 'not_null, boolean, optional',
    });

    if (result.error) {
        res.send(result);
        return;
    }

    data = result.result;

    try {
        const update = await service.update(Number(id), data);
        res.send(make_response(false, update));
    } catch (e) {
        console.error(e);

        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all user docs from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const users = await service.get({ page: page, perPage: perPage });

    if (!error_404(users, res)) return;

    res.send(make_response(false, users));
};

// Retrive user docs by user
export const findByUser = async (req: Request, res: Response) => {
    const id = req.params.id
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const users = await service.getByUser(Number(id), { page: page, perPage: perPage });

    if (!error_404(users, res)) return;

    res.send(make_response(false, users));
};


// Retrive user docs
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await service.retrive(Number(id));

    if (!error_404(user, res)) return;

    res.send(make_response(false, user));
};


// Soft delete user doc
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteOne('users_docs', Number(id));
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete user docs
export const removeByUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByUser(Number(id));
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge users
export const removeAll = async (req: Request, res: Response) => {
    const result = await service.deleteAll("users_docs");

    res.send(make_response(false, result));
};




// // Delete all user
// exports.deleteAll = (req: Request, res: Response) => {
//     Service.purge((err, data) => {
//         if (err) {
//             res.status(500);

//             if (err.kind == 'not_found') {
//                 res.status(404);
//                 err.message = "Not Found!";
//             }

//             res.send({
//                 message:
//                     err.message || "Some error occurred while deleting the user."
//             });
//         }
//         else res.send(data);
//     });
// };

