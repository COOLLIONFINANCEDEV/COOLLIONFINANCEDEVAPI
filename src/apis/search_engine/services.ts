import { company, offer, PrismaClient, role } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

type searchEngineFilter = {
    gt?: string,
    lt?: string,
    eq?: string,
};

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async search({ q, filter, advanced = false, page, perPage }: { q: string; filter: searchEngineFilter; advanced: boolean; page?: number; perPage?: number; }) {
        page = page ? Number(page) : paginationConfig.defaultPage;
        perPage = perPage ? Number(perPage) : paginationConfig.defaultPerPage;
        const queryExpansion = q.length < 15 ? "WITH QUERY EXPANSION" : "";

        // console.log(new Date("po") instanceof Error)

        // AND created_at >= '2022-02-28' AND created_at <= '2022-11-29'
        // @ts-ignore
        const gtClause = filter.gt ? new Date(filter.gt) != "Invalid Date" ? `AND created_at >= ${new Date(filter.gt)}` : "" : "";
        // @ts-ignore
        const ltClause = filter.lt ? new Date(filter.lt) != "Invalid Date" ? `AND created_at <= ${new Date(filter.lt)}` : "" : "";
        // @ts-ignore
        const start = filter.eq ? new Date(filter.eq) != "Invalid Date" ? new Date(filter.eq) : false : false;
        let end: string = "";

        if (start) {
            let lastDigit = filter.eq?.substring(filter.eq?.length - 1);
            end = filter.eq?.substring(0, filter.eq?.length - 1) + String(Number(lastDigit) + 1);
        }

        const eqClause = start ? `AND created_at >= ${start} AND created_at <= ${new Date(end)}` : "";
        const filterClause = `${gtClause} ${ltClause} ${eqClause}`;

        return this.prisma.$queryRawUnsafe<offer[]>(`
            SELECT id, name, description, image, status,
                MATCH (name, description, status) AGAINST (\'${q}\' ${queryExpansion}) AS Score
            FROM offer WHERE
                MATCH (name, description, status) AGAINST (\'${q}\' ${queryExpansion})
        `)
            .then(async (result: (offer | company)[]) => {
                if (!advanced) return result;
                else {
                    const advancedResult = await this.prisma.$queryRawUnsafe<company[]>(`
                        SELECT id, name, description, logo, country, city,
                            MATCH (name, description, country, city) AGAINST (\'${q}\' ${queryExpansion}) AS Score
                        FROM company WHERE
                            MATCH (name, description, country, city) AGAINST (\'${q}\' ${queryExpansion})
                    `);
                    result = [...result, ...advancedResult];

                    return result.sort((a: any, b: any) => a.score - b.score);
                }
            })
            .catch((reason) => {
                if (process.env.DEBUG) console.error(reason);
                else return new Error(reason);
            });
    }
}

export default Service;


