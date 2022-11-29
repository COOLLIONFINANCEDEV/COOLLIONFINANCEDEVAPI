import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

function get_prisma_client() {
    return prisma;
}

export default get_prisma_client;