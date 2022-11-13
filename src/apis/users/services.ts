import { PrismaClient, users } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async retrive(id: number) {
        return await this.prisma.users.findFirst({
            where: { id: id },
            include: {
                role: {
                    select: { name: true }
                },
                user_docs: true,
                wallet: true,
                companies: true,
            }
        });
    }

    async getUser(whereClause: { [x: string]: any }) {
        return await this.prisma.users.findFirst({
            where: whereClause,
            select: { id: true }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.users.findMany({
            include: {
                role: {
                    select: { name: true }
                },
                user_docs: true,
                wallet: true,
                companies: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: users) {
        return await this.prisma.users.create({
            data: data,
        })
    }

    async update(id: number, data: users) {
        return await this.prisma.users.update({
            where: { id: Number(id) },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.users.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    // async deleteAll(entity: any, options?: { [x: string]: any }) {
    //     return await this.prisma.users.deleteMany({
    //         where: {
    //             is_deleted: false
    //         }
    //     });
    // }
}

export default Service;


