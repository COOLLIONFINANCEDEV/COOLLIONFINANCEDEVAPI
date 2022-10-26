import { PrismaClient, investment } from '@prisma/client'

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
        return await this.prisma.investment.findUnique({
            where: { id: id },
            include: {
                offer: true,
                wallet: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.investment.findMany({
            include: {
                offer: true,
                wallet: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByOffer(id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.investment.findMany({
            where: { offer_id: id },
            include: {
                offer: true,
                wallet: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByWallet(id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.investment.findMany({
            where: { wallet_id: id },
            include: {
                offer: true,
                wallet: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: investment) {
        return await this.prisma.investment.create({
            data: data,
        }
        )
    }

    async update(id: number, data: investment) {
        return await this.prisma.investment.update({
            where: { id: Number(id) },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.investment.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    async deleteByOffer(id: number) {
        return await this.prisma.investment.deleteMany({
            where: {
                offer_id: id
            }
        });
    }

    async deleteByWallet(id: number) {
        return await this.prisma.investment.deleteMany({
            where: {
                wallet_id: id
            }
        });
    }
}

export default Service;


