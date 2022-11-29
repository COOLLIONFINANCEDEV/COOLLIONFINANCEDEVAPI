import { Prisma } from '@prisma/client'
import { Response } from 'express';
import make_response from 'src/helpers/make_response';

function error_duplicate_key_constraint(res: Response, e: any, prisma: typeof Prisma) {
    if (e instanceof prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
            if (typeof e.meta?.target === 'string') {
                const field = e.meta?.target.split('_').slice(1);
                field.splice(-1);
                res.send(make_response(true, `Duplicate entry on ${field.join('_')}!`));
            }

            return false;
        }
    }

    return true;
}

export default error_duplicate_key_constraint;