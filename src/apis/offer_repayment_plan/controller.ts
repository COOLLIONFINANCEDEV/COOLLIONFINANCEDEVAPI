import { Request, Response } from 'express';

import Service from 'src/apis/offer_repayment_plan/services';
import { paginationConfig } from 'src/config';
import check_req_body from 'src/helpers/check_req_body';
import make_response from 'src/helpers/make_response';
import serializer from 'src/middlewares/data_serializer';
import error_404 from 'src/middlewares/error_404';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import validator from 'validator';

const service = new Service();


// Create and Save a new offer repayment plan
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        date: 'not_null, date',
        received_amount: 'not_null, float',
        expected_amount: "not_null, float",
        status: "not_null",
        offer_id: "not_null, integer",
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


// Update and Save a new offer repayment plan
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        date: 'not_null, date, optional',
        received_amount: 'not_null, float, optional',
        expected_amount: "not_null, float, optional",
        status: "not_null, optional",
        offer_id: "not_null, integer, optional",
        is_deleted: 'not_null, boolean, optional',
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
        console.error(e);

        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all offer repayment plan from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offerRepaymentPlan = await service.get({ page: page, perPage: perPage });

    if (!error_404(offerRepaymentPlan, res)) return;

    res.send(make_response(false, offerRepaymentPlan));
};

// Retrive offerRepaymentPlan by offerRepaymentPlan
export const findByOffer = async (req: Request, res: Response) => {
    const id = req.params.id
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offerRepaymentPlan = await service.getByOffer(Number(id), res.locals.auth?.user_id, { page: page, perPage: perPage });

    if (!error_404(offerRepaymentPlan, res)) return;

    res.send(make_response(false, offerRepaymentPlan));
};


// Retrive offerRepaymentPlan
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const offerRepaymentPlan = await service.retrive(Number(id), res.locals.auth?.user_id);

    if (!error_404(offerRepaymentPlan, res)) return;

    res.send(make_response(false, offerRepaymentPlan));
};


// Soft delete offerRepaymentPlan doc
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.remove(Number(id), res.locals.auth?.user_id,);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete offerRepaymentPlan
export const removeByOffer = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByOffer(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge offerRepaymentPlan
export const removeAll = async (req: Request, res: Response) => {
    const result = await service.deleteAll("offer_repayment_plan");

    res.send(make_response(false, result));
};




// // Delete all offerRepaymentPlan
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
//                     err.message || "Some error occurred while deleting the offerRepaymentPlan."
//             });
//         }
//         else res.send(data);
//     });
// };

