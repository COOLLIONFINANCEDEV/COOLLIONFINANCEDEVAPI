import { Prisma } from "@prisma/client"

type serviceGetType = {
    entity?: Prisma.ModelName,
    page?: number,
    perPage?: number,
}

export default serviceGetType;

