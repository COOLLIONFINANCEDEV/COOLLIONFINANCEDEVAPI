import { PrismaClient, Prisma } from '@prisma/client'
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';
import validator from 'validator';

const client = new PrismaClient();


class BaseService {
    constructor() {
        client.$use(async (params, next) => {
            if (params.args == undefined) params.args = {}

            // console.log(params.args);

            if (params.model == 'users') {
                if (params.action == 'findFirst'
                    || params.action == "findMany") {
                    if (params.args['where'] == undefined) params.args['where'] = {};
                    params.args['where']["is_deleted"] = false;
                }
            }



            if (params.action == 'delete') {
                // Delete queries
                // Change action to an update
                params.action = 'update'
                params.args['data'] = { is_deleted: true }
            }
            if (params.action == 'deleteMany') {
                // Delete many queries
                params.action = 'updateMany'
                if (params.args.data !== undefined)
                    params.args.data['is_deleted'] = true;
                else
                    params.args['data'] = { is_deleted: true };
            }
            return next(params);
        });
    }

    get_prisma_client() {
        return client;
    }

    get_prisma() {
        return Prisma;
    }

    async deleteAll(entity: Prisma.ModelName, options?: { [x: string]: any }) {
        // client.$use(async (params, next) => {
        //     params.model = entity;
        //     console.log(params.args);
        //     console.log(options);


        //     params.args = options || { where: { id: 1 } }

        //     // for (const key in options)
        //     //     params.args[key] = options[key];

        //     console.log(params.args);

        //     if (params.action == 'delete') {
        //         // Delete queries
        //         // Change action to an update
        //         params.action = 'update'
        //         params.args['data'] = { is_deleted: true }
        //     }
        //     if (params.action == 'deleteMany') {
        //         // Delete many queries
        //         params.action = 'updateMany'
        //         if (params.args.data !== undefined)
        //             params.args.data['is_deleted'] = true;
        //         else
        //             params.args['data'] = { is_deleted: true };
        //     }
        //     return await next(params);
        // });

        const sql = `UPDATE ${entity} SET is_deleted = true WHERE is_deleted = false`;

        return { "count": await client.$executeRawUnsafe(sql) }
    }


    async deleteOne(entity: Prisma.ModelName, id: number, options?: { [x: string]: any }) {
        const sql = `UPDATE ${entity} SET is_deleted = true WHERE id = ${Number(validator.escape(String(id)))}`;

        return { "count": await client.$executeRawUnsafe(sql) }
    }

    async get(params: serviceGetType): Promise<any> {

        if (params.entity == undefined) throw new Error("entity param is optional but cannot be null!")
        if (params.page == undefined) params.page = paginationConfig.defaultPage;
        if (params.perPage == undefined) params.perPage = paginationConfig.defaultPage;

        const sql = `SELECT * FROM ${params.entity} WHERE is_deleted = 0 LIMIT ${params.perPage}, ${(params.page - 1) * params.perPage}`;

        return await client.$queryRawUnsafe(sql);
    }

    async isOwner(entity: Prisma.ModelName, id: number, owner: number, constraint = "user_id") {
        
        const sql = `SELECT ${constraint} FROM ${entity} WHERE id = ${Number(validator.escape(String(id)))}`;
        const req: any = await client.$queryRawUnsafe(sql);

        console.log(sql);
        console.log(req);
        

        return req.length ? (req[0][constraint] === owner ? true : false) : true;
    }
}

export default BaseService;



