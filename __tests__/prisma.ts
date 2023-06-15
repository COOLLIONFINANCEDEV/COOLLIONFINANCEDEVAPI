import { PrismaClient } from "@prisma/client";
import { groupBy } from "../src/utils/group-by.helper";

const prisma = new PrismaClient();

const main = async (userId: number) => {
    const data = await prisma.userTenant.groupBy({
        by: ['tenantId'],
        where: { userId }
    });

    // return userTenants.length;

        console.log(data);
};


main(21);

