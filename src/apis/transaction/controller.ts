import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/transaction/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';

const service = new Service();

// const { check_body } = require("../utils/check_body.js");
// import Hasher from "helpers/hasher";
// import Service from 'apis/transaction/service'

// const Service = new UserServices(undefined, 'transaction');


// Create and Save a new transaction
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float',
        type: "not_null",
        status: "not_null",
        wallet_id: "not_null, integer",
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


// Update and Save a new transaction
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float, optional',
        type: "not_null, optional",
        status: "not_null, optional",
        wallet_id: "not_null, integer, optional",
        is_deleted: "not_null, boolean, optional"
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const update = await service.update(Number(id), res.locals.auth?.user_id, data);
        res.send(make_response(false, update));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all transaction from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const transaction = await service.get({ page: page, perPage: perPage });

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Retrive transaction
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await service.retrive(Number(id), res.locals.auth?.user_id);

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Retrive transaction by user
export const findByWallet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await service.retriveByWallet(Number(id), res.locals.auth?.user_id);

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Soft delete transaction
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const transaction = await service.remove(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, transaction));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete transaction by user
export const removeByWallet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByWallet(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge transaction
export const removeAll = async (req: Request, res: Response) => {
    const transaction = await service.deleteAll("transaction");

    res.send(make_response(false, transaction));
};




// // Delete all transaction
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
//                     err.message || "Some error occurred while deleting the transaction."
//             });
//         }
//         else res.send(data);
//     });
// };

