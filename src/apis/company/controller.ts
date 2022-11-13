import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/company/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import Hasher from 'src/helpers/hasher';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { paginationConfig } from 'src/config';

const service = new Service();

// Create and Save a new company
export const create = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null',
        email: 'not_null, email',
        phone: 'number',
        manager_id: 'integer, not_null',
        description: 'not_null, optional',
        logo: 'not_null, optional',
        country: 'not_null, optional',
        city: 'not_null, optional',
    });


    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;


    try {
        const insert = await service.create(data);
        res.send(make_response(false, insert));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        throw e;
    }
}


// Update and Save a new user
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        name: 'not_null, optional',
        email: 'not_null, email, optional',
        phone: 'number, optional',
        manager_id: 'integer, not_null, optional',
        description: 'not_null, optional',
        logo: 'not_null, optional',
        country: 'not_null, optional',
        city: 'not_null, optional',
        is_deleted: "boolean, optional",
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


// get all companies from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const companies = await service.get({ page: page, perPage: perPage });

    if (!error_404(companies, res)) return;

    res.send(make_response(false, companies));
};


// Retrive company
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await service.retrive(Number(id));

    if (!error_404(company, res)) return;

    res.send(make_response(false, company));
};


// Retrive companies by manager
export const findByUser = async (req: Request, res: Response) => {
    const id = req.params.id
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const companies = await service.getByUser(Number(id), { page: page, perPage: perPage });

    if (!error_404(companies, res)) return;

    res.send(make_response(false, companies));
};


// Soft delete company
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const company = await service.deleteOne('company', Number(id));
        res.send(make_response(false, company));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge companies
export const removeAll = async (req: Request, res: Response) => {
    const user = await service.deleteAll("company");

    res.send(make_response(false, user));
};


