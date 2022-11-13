import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/offer/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import Hasher from 'src/helpers/hasher';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';

const service = new Service();

// Create and Save a new offer
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;


    const result = serializer(data, {
        name: 'not_null',
        description: 'not_null',
        image: 'optional, not_null',
        total_investment_to_raise: 'float',
        price_per_unit: 'float',
        number_of_unit: 'float',
        maximum_amount: 'float',
        minimum_amount: 'float',
        investment_term: 'date',
        distribution_frequency: 'integer',
        start_payment: 'date',
        expected_return: 'optional',
        status: 'optional',
        company_id: 'integer, not_null',
    });


    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    // data['investment_term'] = new Date(data['investment_term']);
    // data['start_payment'] = new Date(data['start_payment']);


    try {
        const insert = await service.create(data);
        res.send(make_response(false, insert));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        throw e;
    }
}


// Update and Save a new offer
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null, optional',
        image: 'optional, not_null, optional',
        total_investment_to_raise: 'float, optional',
        price_per_unit: 'float, optional',
        number_of_unit: 'float, optional',
        maximum_amount: 'float, optional',
        minimum_amount: 'float, optional',
        investment_term: 'optional, date',
        description: 'not_null, optional',
        distribution_frequency: 'integer, optional',
        start_payment: 'optional, date',
        expected_return: 'optional, float',
        status: 'optional, not_null',
        is_deleted: "boolean, optional",
    });



    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;


    // data['investment_term'] = new Date(data['investment_term']);
    // data['start_payment'] = new Date(data['start_payment']);

    try {
        const update = await service.update(Number(id), res.locals.auth?.user_id, data);
        res.send(make_response(false, update));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all offers from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const offers = await service.get({ page: page, perPage: perPage });

    if (!error_404(offers, res)) return;

    res.send(make_response(false, offers));
};


// Retrive offer
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await service.retrive(Number(id), res.locals.auth?.user_id);

    if (!error_404(offer, res)) return;

    res.send(make_response(false, offer));
};


// Soft delete offer
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const offer = await service.remove(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, offer));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge offer
export const removeAll = async (req: Request, res: Response) => {
    const user = await service.deleteAll("offer");

    res.send(make_response(false, user));
};


