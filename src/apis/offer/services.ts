import { PrismaClient, offer, Prisma } from '@prisma/client'

import BaseService from 'src/apis/base_service';
import { paginationConfig } from 'src/config';
import serviceGetType from 'src/types/service_get_type';
import { v4 as uuidv4 } from 'uuid';

import TransactionService from 'src/apis/transaction/services';

class Service extends BaseService {
    prisma: PrismaClient;
    MAXIMUM_DAY_BEFORE_PAY_BORROWER: number = 20;
    MAXIMUM_DAY_BEFORE_BORROWER_REFUND: number = 30;

    constructor() {
        super();
        this.prisma = super.get_prisma_client();
    }

    // async init_event(insert: offer) {
    //     const date = new Date();
    //     const dateToStartRefund = date.setDate(date.getDate() + this.MAXIMUM_DAY_BEFORE_BORROWER_REFUND);
    //     const diffInTime = (new Date(insert.loan_length)).getTime() - (new Date(dateToStartRefund)).getTime();
    //     const diffDays = diffInTime / (1000 * 3600 * 24);
    //     const amountToRefundPerMonth = 

    //     await this.prisma.$queryRawUnsafe(`
    //         CREATE EVENT IF NOT EXISTS ${uuidv4} ON SCHEDULE EVERY 30 DAY
    //         STARTS ${dateToStartRefund}
    //         ENDS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    //         DO
    //                 CALL GET_VARIABLE (
    //                     "MAXIMUM_DAY_BEFORE_BORROWER_REFUND",
    //                     @MAXIMUM_DAY_BEFORE_BORROWER_REFUND
    //                 )

    //                 SELECT disbursed_date FROM offer WHERE id = -1 INTO @DISBURSED_DATE;

    //                 SELECT
    //                     DATE_ADD(
    //                         @DISBURSED_DATE,
    //                         INTERVAL @MAXIMUM_DAY_BEFORE_BORROWER_REFUND DAY
    //                     ) INTO @REFUND_START_DATE;

    //                 IF @REFUND_START_DATE < CURRENT_DATE
    //                 END IF;
    //                 CALL BALANCE_CALCULATOR(NEW.wallet_id, @balance);
    //     `);
    // }

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
        return await this.prisma.offer.findMany({
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