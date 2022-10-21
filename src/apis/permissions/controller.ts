import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/permissions/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';

const service = new Service();

// const { check_body } = require("../utils/check_body.js");
// import Hasher from "helpers/hasher";
// import Service from 'apis/permissions/service'

// const Service = new UserServices(undefined, 'permissions');


// Create and Save a new permissions
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null',
        description: 'not_null',
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


// Update and Save a new permissions
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null, optional',
        description: 'not_null, optional',
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
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all permissions from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const roles = await service.get({ page: page, perPage: perPage });

    if (!error_404(roles, res)) return;

    res.send(make_response(false, roles));
};


// Retrive permissions
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const permissions = await service.retrive(Number(id));

    if (!error_404(permissions, res)) return;

    res.send(make_response(false, permissions));
};


// Soft delete permissions
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const permissions = await service.deleteOne('permissions', Number(id));
        res.send(make_response(false, permissions));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge permissions
export const removeAll = async (req: Request, res: Response) => {
    const permissions = await service.deleteAll("permissions");

    res.send(make_response(false, permissions));
};




// // Delete all permissions
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
//                     err.message || "Some error occurred while deleting the permissions."
//             });
//         }
//         else res.send(data);
//     });
// };

