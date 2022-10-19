import { Prisma } from '@prisma/client'
import { Response } from 'express';
import make_response from 'src/helpers/make_response';

function error_update_record_not_found(res: Response, e: any, prisma: typeof Prisma) {
    if (e instanceof prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2025') {
            res.status(404).send(make_response(true, "Not Found"));

            return false;
        }
    }

    return true;
}

export default error_update_record_not_found;