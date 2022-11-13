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

    async retrive(id: number, user_id: number) {
        return await this.prisma.investment.findFirst({
            where: {
                id: id,
                wallet: {
                    user_id: user_id
                }
            },
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

    async getByOffer(id: number, manager_id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.investment.findMany({
            where: {
                offer_id: id,
                wallet: {
                    user_id: manager_id
                }
            },
            include: {
                offer: true,
                wallet: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByWallet(id: number, user_id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.investment.findMany({
            where: {
                wallet: {
                    id: id,
                    user_id: user_id
                }
            },
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

    async update(id: number, user_id: number, data: investment) {
        return await this.prisma.investment.updateMany({
            where: {
                id: Number(id),
                wallet: {
                    user_id: user_id
                }
            },
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

    async deleteByOffer(id: number, manager_id: number) {
        return await this.prisma.investment.deleteMany({
            where: {
                offer_id: id,
                wallet: {
                    user_id: manager_id
                }
            }
        });
    }

    async deleteByWallet(id: number, user_id: number) {
        return await this.prisma.investment.deleteMany({
            where: {
                wallet: {
                    id: id,
                    user_id: user_id
                }
            }
        });
    }

    async remove(id: number, user_id: number) {
        return await this.prisma.investment.deleteMany({
            where: {
                id: id,
                wallet: {
                    user_id: user_id
                }
            }
        });
    }
}

export default Service;


