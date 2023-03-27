import { Request, Response, NextFunction } from 'express';
import debug from 'debug';
import CustomResponse from './response.helper';

const logger = debug("coollion:middleware:error");

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger(err.stack);
    new CustomResponse(res)[500]({ message: "Something broke!" });
}



