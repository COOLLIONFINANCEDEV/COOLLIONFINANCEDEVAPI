import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/wallet/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';

const service = new Service();

// const { check_body } = require("../utils/check_body.js");
// import Hasher from "helpers/hasher";
// import Service from 'apis/wallet/service'

// const Service = new UserServices(undefined, 'wallet');


// Create and Save a new wallet
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float',
        user_id: "not_null, integer",
    });

    if (result.error) {
        res.status(400).send(result);
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


// Update and Save a new wallet
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float, optional',
        user_id: "not_null, integer, optional",
        is_deleted: "not_null, boolean, optional",
    });

    if (result.error) {
        res.status(400).send(result);
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


// get all wallet from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const wallet = await service.get({ page: page, perPage: perPage });

    if (!error_404(wallet, res)) return;

    res.send(make_response(false, wallet));
};


// Retrive wallet
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const wallet = await service.retrive(Number(id));

    if (!error_404(wallet, res)) return;

    res.send(make_response(false, wallet));
};


// Retrive wallet by user
export const findByUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const wallet = await service.retriveByUser(Number(id));

    if (!error_404(wallet, res)) return;

    res.send(make_response(false, wallet));
};


// Soft delete wallet
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const wallet = await service.deleteOne('wallet', Number(id));
        res.send(make_response(false, wallet));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete wallet by user
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


// Soft purge wallet
export const removeAll = async (req: Request, res: Response) => {
    const wallet = await service.deleteAll("wallet");

    res.send(make_response(false, wallet));
};




// // Delete all wallet
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
//                     err.message || "Some error occurred while deleting the wallet."
//             });
//         }
//         else res.send(data);
//     });
// };

