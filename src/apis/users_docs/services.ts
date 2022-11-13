import { PrismaClient, users_docs } from '@prisma/client'

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
        return await this.prisma.users_docs.findFirst({
            where: { id: id },
            include: {
                user: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.users_docs.findMany({
            include: {
                user: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByUser(id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.users_docs.findMany({
            where: { user_id: id },
            include: {
                user: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: users_docs) {
        return await this.prisma.users_docs.create({
            data: data,
        }
        )
    }

    async update(id: number, data: users_docs) {
        return await this.prisma.users_docs.update({
            where: { id: Number(id) },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.users_docs.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    async deleteByUser(id: number) {
        return await this.prisma.users_docs.deleteMany({
            where: {
                user_id: id
            }
        });
    }
}

export default Service;


