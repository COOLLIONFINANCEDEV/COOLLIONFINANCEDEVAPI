import { PrismaClient, transaction } from '@prisma/client'

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
        return await this.prisma.transaction.findUnique({
            where: { id: id },
            include: {
                wallet: true,
            }
        });
    }

    async retriveByWallet(id: number) {
        return await this.prisma.transaction.findFirst({
            where: { wallet_id: id },
            include: {
                wallet: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.transaction.findMany({
            include: {
                wallet: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: transaction) {
        return await this.prisma.transaction.create({
            data: data,
        }
        )
    }

    async update(id: number, data: transaction) {
        return await this.prisma.transaction.update({
            where: { id: Number(id) },
            data: data
        })
    }

    async deleteByWallet(id: number) {
        return await this.prisma.transaction.deleteMany({
            where: {
                wallet_id: id
            }
        });
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.transaction.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    // async deleteAll(entity: any, options?: { [x: string]: any }) {
    //     return await this.prisma.transaction.deleteMany({
    //         where: {
    //             is_deleted: false
    //         }
    //     });
    // }
}

export default Service;


