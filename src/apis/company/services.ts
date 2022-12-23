import { Prisma, PrismaClient, company } from '@prisma/client'

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
        Prisma.CompanyScalarFieldEnum
        const o = {
            id: 'id',
            name: 'name',
            description: 'description',
            logo: 'logo',
            localisation: 'localisation',
            phone: 'phone',
            email: 'email',
            domain: 'domain',
            website: 'website',
            payment_information: 'payment_information',
            about_me: 'about_me',
            is_deleted: 'is_deleted',
            created_at: 'created_at',
            updated_at: 'updated_at',
            manager_id: 'manager_id'
        };
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


