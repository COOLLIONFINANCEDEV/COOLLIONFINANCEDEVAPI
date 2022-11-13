import { PrismaClient, company } from '@prisma/client'

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
        return await this.prisma.company.findFirst({
            where: { id: id },
            include: {
                manager: true,
                offers: true,
            }
        });
    }

    async getByUser(id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.company.findMany({
            where: { manager_id: id },
            include: {
                offers: true
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.company.findMany({
            include: {
                manager: true,
                offers: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: company) {
        return await this.prisma.company.create({
            data: data,
        }
        )
    }

    async update(id: number, data: company) {
        return await this.prisma.company.update({
            where: { id: Number(id) },
            data: data
        })
    }

}

export default Service;


