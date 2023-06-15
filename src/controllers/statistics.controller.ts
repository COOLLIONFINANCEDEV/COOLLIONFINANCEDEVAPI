import debug from "debug";
import { Response } from "express";
import { getTotalInvestmentAmountPerTenant, getTotalInvestments, getTotalInvestmentsPerTenant } from "../services/investment.service";
import { getTotalProjects, getTotalProjectsPerTenant } from "../services/project.service";
import { getTotalTenants, getUserCountsPerTenant } from "../services/tenant.service";
import { getTotalTransactions, getTotalTransactionsSentByOneTenant } from "../services/transaction.service";
import { ICustomRequest } from "../types/app.type";
import CustomResponse from "../utils/response.helper";

export const statistics = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:statistics:statistics');

    try {
        // const { tenantId } = req.auth!;
        const tenantId = 5;  // TODO: remove
        const { can } = req.abilities!;
        const { specify } = req.params;
        let tenantCounts: number | null = 0;
        let tenantUserCounts: number | null = 0;
        let investementCounts: number | null = 0;
        let totalAmountInvest: number | null = 0;
        let totalDueAmountInvest: number | null = 0;
        let totalAmountDrawn: number | null = 0;
        let projectsCounts: number | null = 0;
        let transactionsCounts: number | null = 0;

        if (!specify || specify === "tenant") {
            if (can("manage", "Tenant"))
                tenantCounts = await getTotalTenants();

            tenantUserCounts = await getUserCountsPerTenant(tenantId);
        }

        if (!specify || specify === "investment") {
            if (can("manage", "Investment"))
                investementCounts = await getTotalInvestments();
            else {
                investementCounts = await getTotalInvestmentsPerTenant(tenantId);
                const totalInvestmentAmountPerTenant = await getTotalInvestmentAmountPerTenant(tenantId);

                if (totalInvestmentAmountPerTenant.length > 0) {
                    totalAmountInvest = totalInvestmentAmountPerTenant[0]._sum.amount;
                    totalDueAmountInvest = totalInvestmentAmountPerTenant[0]._sum.dueAmount;
                }

                const totalCollectedInvestmentAmountWithGainPerTenant = await getTotalInvestmentAmountPerTenant(tenantId);

                if (totalCollectedInvestmentAmountWithGainPerTenant.length > 0) {
                    totalAmountDrawn = totalCollectedInvestmentAmountWithGainPerTenant[0]._sum.dueAmount;
                }
            }
        }

        if (!specify || specify === "project") {
            if (can("manage", "Project"))
                projectsCounts = await getTotalProjects();
            else projectsCounts = await getTotalProjectsPerTenant(tenantId);
        }

        if (!specify || specify === "transaction") {
            if (can("manage", "Transaction"))
                transactionsCounts = await getTotalTransactions();
            else transactionsCounts = await getTotalTransactionsSentByOneTenant(tenantId);
        }

        response[200]({
            data: [{
                tenantCounts,
                tenantUserCounts,

                investementCounts,
                totalAmountInvest,
                totalDueAmountInvest,
                totalAmountDrawn,

                projectsCounts,

                transactionsCounts,
            }]
        });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
}
