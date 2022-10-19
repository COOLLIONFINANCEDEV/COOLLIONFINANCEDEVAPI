import { Prisma } from '@prisma/client'
import { Response } from 'express';
import make_response from 'src/helpers/make_response';

function error_foreign_key_constraint(res: Response, e: any, prisma: typeof Prisma) {
    if (e instanceof prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2003') {
            res.send(make_response(true, `Foreign key constraint failed on the field: ${e.meta?.field_name}`));

            return false;
        }
    }

    return true;
}

export default error_foreign_key_constraint;