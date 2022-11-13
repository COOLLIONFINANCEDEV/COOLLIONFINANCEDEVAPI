import { PrismaClient, wallet } from '@prisma/client'

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
        return await this.prisma.wallet.findFirst({
            where: { id: id },
            include: {
                user: true,
                investments: true,
                transactions: true,
            }
        });
    }

    async retriveByUser(id: number) {
        return await this.prisma.wallet.findFirst({
            where: { user_id: id },
            include: {
                user: true,
                investments: true,
                transactions: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.wallet.findMany({
            include: {
                user: true,
                investments: true,
                transactions: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: wallet) {
        return await this.prisma.wallet.create({
            data: data,
        }
        )
    }

    async update(id: number, data: wallet) {
        return await this.prisma.wallet.update({
            where: { id: Number(id) },
            data: data
        })
    }

    async deleteByUser(id: number) {
        return await this.prisma.wallet.deleteMany({
            where: {
                user_id: id
            }
        });
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.wallet.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    // async deleteAll(entity: any, options?: { [x: string]: any }) {
    //     return await this.prisma.wallet.deleteMany({
    //         where: {
    //             is_deleted: false
    //         }
    //     });
    // }
}

export default Service;


