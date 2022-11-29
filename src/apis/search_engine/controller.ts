import { Request, Response } from 'express';

import Service from 'src/apis/search_engine/services';
import { paginationConfig } from 'src/config';
import init_array_key from 'src/helpers/init_array_key';
import init_object_key from 'src/helpers/init_object_key';
import make_response from 'src/helpers/make_response';
import serializer from 'src/middlewares/data_serializer';
import error_404 from 'src/middlewares/error_404';
import validator from 'validator';

const service = new Service();

// get all role from the database (with condition).
export const search = async (req: Request, res: Response) => {
    const q: string = String(req.query.q);
    const advanced: boolean = validator.toBoolean(String(req.query.advanced), true);
    const filter: any = req.query.filter || {};
    let page: string | number = String(req.query.page);
    let perPage: string | number = String(req.query.perPage);
    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    try {
        const result = await service.search({ q, filter, advanced, page, perPage });
        if (result instanceof Error) {
            if (process.env.DEBUG) console.error(result);

            throw result;
        }


        res.send(make_response(false, result));
    } catch (error) {
        res.status(500).send(make_response(true, "Internal Server Error!"));
    }
};


