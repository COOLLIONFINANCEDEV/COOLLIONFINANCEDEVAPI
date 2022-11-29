import { PrismaClient } from '@prisma/client'

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

        return await this.prisma.users.findFirst({
            where: whereClause,
            select: {
                id: true,
                desable: true,
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

    async retriveUser({ id, whereClause = { two_fa: true }, selectedItems = {} }: { id: number; whereClause?: { [x: string]: any; }; selectedItems?: { [x: string]: any; }; }) {
        whereClause["id"] = id;
        return await this.prisma.users.findFirst({
            where: whereClause,
            select: {
                contact: true,
                email: true,
                ...selectedItems
            }
        });
    }

    // async save(data: oauth) {
    //     return await this.prisma.oauth.create({
    //         data: data,
    //     })
    // }
}


export default Service;


