import { Request, Response, NextFunction } from 'express';
import CustomResponse from './response.helper';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    new CustomResponse(res)[404]({ message: "Resource  not found!" });
}
