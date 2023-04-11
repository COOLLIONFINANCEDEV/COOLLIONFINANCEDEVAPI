import Joi, { ObjectSchema } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import CustomResponse from './response.helper';
import { TJoiSimplifiedError, TJoiValidationError } from '../types/app.type';

export const validator = (schema?: ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (schema === undefined) throw new Error(`Invalid schema`);

        try {
            const value = await schema.validateAsync(req.body, { abortEarly: false });

            req.body = value;
            next();
        } catch (err: any) {
            const errors: TJoiSimplifiedError[] = [];

            err.details.forEach(({ message, context }: TJoiValidationError) => {
                const { key } = context;
                errors.push({ field: key, message });
            });

            const response = new CustomResponse(res);
            response[400]({ errors });
        }
    };
}
