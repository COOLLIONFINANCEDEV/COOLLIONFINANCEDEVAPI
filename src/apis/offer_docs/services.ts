import { PrismaClient, offer_docs } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async retrive(id: number, manager_id: number) {
        return await this.prisma.offer_docs.findFirst({
            where: {
                id: id,
                offer: {
                    company: {
                        manager_id: manager_id
                    }
                }
            },
            include: {
                offer: true,
            }
        });
    }

    async get(params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.offer_docs.findMany({
            include: {
                offer: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async getByOffer(id: number, manager_id: number, params: serviceGetType) {
        let page = params.page ? Number(params.page) : paginationConfig.defaultPage;
        let perPage = params.perPage ? Number(params.perPage) : paginationConfig.defaultPerPage;

        return await this.prisma.offer_docs.findMany({
            where: {
                offer: {
                    id: id,
                    company: {
                        manager_id: manager_id
                    }
                }
            },
            include: {
                offer: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }

    async create(data: offer_docs) {
        return await this.prisma.offer_docs.create({
            data: data,
        }
        )
    }

    async update(id: number, manager_id: number, data: offer_docs) {
        return await this.prisma.offer_docs.updateMany({
            where: {
                id: Number(id),
                offer: {
                    company: {
                        manager_id: manager_id
                    }
                }
            },
            data: data
        })
    }

    // async deleteOne(id: number) {
    //     return await this.prisma.offer_docs.delete({
    //         where: {
    //             id: id
    //         }
    //     });
    // }

    async remove(id: number, manager_id: number) {
        return await this.prisma.offer_docs.deleteMany({
            where: {
                id: Number(id),
                offer: {
                    company: {
                        manager_id: manager_id
                    }
                }
            }
        })
    }

    async deleteByOffer(id: number, manager_id: number) {
        return await this.prisma.offer_docs.deleteMany({
            where: {
                offer: {
                    id: id,
                    company: {
                        manager_id: manager_id
                    }
                }

            }
        });
    }
}

export default Service;


