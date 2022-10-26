import { PrismaClient, oauth } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';

class Service extends BaseService {
    prisma: PrismaClient;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    async getUser(column: "email" | "contact", value: string) {
        const whereClause = column == "email" ? { email: value } : { contact: value };

        return await this.prisma.users.findUnique({
            where: whereClause,
            select: {
                id: true,
                two_fa: true,
                salt: true,
                password: true,
                role_id: true,
                role: {
                    select: { name: true }
                }
            }
        });
    }

    async save(data: oauth) {
        return await this.prisma.oauth.create({
            data: data,
        })
    }
}


export default Service;


