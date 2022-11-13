import { PrismaClient, role } from '@prisma/client'

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
        return await this.prisma.role.findFirst({
            where: { id: id },
            include: {
                role_: true
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.role.findMany({
            include: {
                role_: true
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: role) {
        return await this.prisma.role.create({
            data: data,
        }
        )
    }

    async update(id: number, data: role) {
        return await this.prisma.role.update({
            where: { id: Number(id) },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.role.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    // async deleteAll(entity: any, options?: { [x: string]: any }) {
    //     return await this.prisma.role.deleteMany({
    //         where: {
    //             is_deleted: false
    //         }
    //     });
    // }
}

export default Service;


