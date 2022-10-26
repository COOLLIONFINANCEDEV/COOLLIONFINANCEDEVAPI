import { PrismaClient, offer_repayment_plan } from '@prisma/client'

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
        return await this.prisma.offer_repayment_plan.findUnique({
            where: { id: id },
            include: {
                offer: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.offer_repayment_plan.findMany({
            include: {
                offer: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByOffer(id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.offer_repayment_plan.findMany({
            where: { offer_id: id },
            include: {
                offer: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: offer_repayment_plan) {
        return await this.prisma.offer_repayment_plan.create({
            data: data,
        }
        )
    }

    async update(id: number, data: offer_repayment_plan) {
        return await this.prisma.offer_repayment_plan.update({
            where: { id: Number(id) },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.offer_repayment_plan.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    async deleteByOffer(id: number) {
        return await this.prisma.offer_repayment_plan.deleteMany({
            where: {
                offer_id: id
            }
        });
    }
}

export default Service;


