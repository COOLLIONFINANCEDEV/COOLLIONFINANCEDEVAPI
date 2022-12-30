import { PrismaClient, offer, Prisma } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async simple_retrive(id: number) {
        return await this.prisma.offer.findFirst({
            where: {
                id: id,
            },
            include: {
                investment: true,
                company: true,
            }
        });
    }

    async retrive(id: number, manager_id: number) {
        return await this.prisma.offer.findFirst({
            where: {
                company: {
                    id: id,
                    manager_id: manager_id
                }
            },
            include: {
                company: true,
                investment: true,
                offer_repayment_plans: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.offer.findMany({
            include: {
                company: true,
                investment: true,
                offer_repayment_plans: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: offer) {
        return await this.prisma.offer.create({
            data: data,
        }
        )
    }

    async update(id: number, manager_id: number, data: offer) {
        return await this.prisma.offer.updateMany({
            where: {
                id: Number(id),
                company: {
                    manager_id: manager_id
                }
            },
            data: data
        })
    }

    async remove(id: number, manager_id: number) {
        return await this.prisma.offer.deleteMany({
            where: {
                id: Number(id),
                company: {
                    manager_id: manager_id
                }
            }
        })
    }

}

export default Service;