import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TJoiSimplifiedError } from "../types/app.type";

export const handlePrismaError = (error: any, logger: any) => {
    const errors: TJoiSimplifiedError[] = [];

    if (error.code === 'P2002') {
        const field = error.meta.target.split("_")[1];
        errors.push({
            field,
            message: `The value of the field "${field}" already used.`
        });
    }
    else if (error.code === 'P2003') {
        const field = error.meta.field_name;

        errors.push({
            field,
            message: `The value of the field "${field}" does not exist in the database.`
        });
    }
    else if (error.code === 'P2025') {
        const cause = error.meta.cause;

        errors.push({
            field: "RecordNotFound",
            message: cause
        });
    }

    return errors;
}