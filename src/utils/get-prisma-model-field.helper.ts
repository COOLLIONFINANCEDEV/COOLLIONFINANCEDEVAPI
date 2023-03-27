import { Prisma } from "@prisma/client";

export const getPrismaModelField = (modelName: Prisma.ModelName) => {
    const dmmf = Prisma.dmmf.datamodel.models.find(value => value.name === modelName);
    if (dmmf === undefined) return undefined;
    return dmmf.fields.map((field: any) => field.name);
};