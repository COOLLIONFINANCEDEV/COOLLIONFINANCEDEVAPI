import { PrismaClient, users } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async getUser(id: number) {
        return await this.prisma.users.findFirst({
            where: { id: id, two_fa: true, is_deleted: false, desable: false },
            select: {
                contact: true,
                email: true,
            }
        });
    }
}

export default Service;


