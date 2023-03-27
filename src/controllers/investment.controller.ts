import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { app as appConfig } from "../configs/app.conf";
import { getInvestmentById } from "../models/investment.model";
import { getProjectById } from "../models/project.model";
import { getWalletById } from "../models/wallet.model";
import { getInvestmentTermById } from "../services/investment-term.service";
import { getAllInvestments, registerInvestment } from "../services/investment.service";
import { registerTransaction } from "../services/transaction.service";
import { getWalletByTenantId, updateWallet } from "../services/wallet.service";
import { ICustomRequest } from "../types/app.type";
import { addMonthsToDate } from "../utils/add-month-to-date.helper";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import { randomUUID } from "crypto";

// export const listForOther = async (req: ICustomRequest, res: Response) => {
//     const response = new CustomResponse(res);
//     const logger = debug('coollionfi:investment:retrive');

//     try {
//         const { projectId, page, perPage } = req.params;

//         if (isNaN(Number(projectId)))
//             return response[400]({ message: 'Invalid query parameter projectId.' });

//         const project = await getProjectById(Number(projectId));

//         if (!project)
//             return response[404]({ message: "The selected project is unvailable!" });

//         const investments = await getAllInvestments({
//             where: {
//                 projectId: Number(projectId)
//             },
//             page: Number(page), perPage: Number(perPage)
//         });

//         const filteredInvestments = await abilitiesFilter({
//             subject: "Investment",
//             abilities: req.abilities as Required<ICustomRequest>["abilities"],
//             input: investments,
//             selfInput: false
//         });
//         const finalInvestments = await outItemFromList(filteredInvestments);

//         response[200]({ data: finalInvestments });
//     } catch (err) {
//         logger(err);
//         response[500]({ message: "An error occurred while reading information." });
//     }
// };


export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investment:retrive');

    try {
        const { tenantId } = req.auth!;
        const { projectId, selfOrOther, page, perPage } = req.params;

        if (projectId && (isNaN(Number(selfOrOther)) || ![0, 1].includes(Number(selfOrOther))))
            return response[400]({
                message: 'Invalid query parameter selfOrOther.',
                errors: [{
                    field: 'query parameter: selfOrOther',
                    message: "It must be a Bit, 0 for the list of investments of the connected tenant and 1 for the others."
                }]
            });

        const otherOrSelf = projectId ? Boolean(Number(selfOrOther)) : false;

        if (otherOrSelf)
            if (isNaN(Number(projectId)))
                return response[400]({ message: 'Invalid query parameter projectId.' });

        const project = isNaN(Number(projectId)) ? undefined : { projectId: Number(projectId) };
        const funder = otherOrSelf ? undefined : { funder: tenantId };
        const investments = await getAllInvestments({
            where: {
                ...project,
                ...funder
            },
            page: Number(page), perPage: Number(perPage)
        });
        const filteredInvestments = await abilitiesFilter({
            subject: "Investment",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: investments,
            selfInput: !otherOrSelf
        });
        const finalInvestments = await outItemFromList(filteredInvestments);
        
        response[200]({ data: finalInvestments });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investment:retrive');

    try {
        const { tenantId } = req.auth!;
        const { investmentId } = req.params;

        if (isNaN(Number(investmentId)))
            return response[400]({ message: 'Invalid query parameter investmentId.' });

        const investment = await getInvestmentById(Number(investmentId));

        if (!investment)
            return response[404]({ message: "Record not found!" });

        const filteredInvestment = await abilitiesFilter({
            subject: "Investment",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [investment],
            selfInput: investment.funder === tenantId
        });
        const finalInvestment = await outItemFromList(filteredInvestment);

        response[200]({ data: finalInvestment });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const invest = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:investment:invest');

    try {
        const masterWalletId = appConfig.masterWalletId;

        if (isNaN(masterWalletId)) {
            logger("Master wallet ID is not specified!");
            return response[500]();
        }

        const masterWallet = await getWalletById(masterWalletId);

        if (!masterWallet) {
            logger("Master wallet is not registered!");
            return response[500]();
        }

        const { amount, projectId, term } = req.body;
        const { userId, tenantId } = req.auth!;
        const project = await getProjectById(projectId);
        const respectMinimumToInvest = appConfig.minimumToInvest ? appConfig.minimumToInvest <= amount : true;

        if (!respectMinimumToInvest)
            return response[400]({ message: `You have not reached the minimum amount you can invest, $${appConfig.minimumToInvest}` });

        const respectMaximumToInvest = appConfig.maximumToInvest ? appConfig.maximumToInvest >= amount : true;

        if (!respectMaximumToInvest)
            return response[400]({ message: `You exceed the maximum amount you can invest, $${appConfig.maximumToInvest}` });
        
        if (!project)
            return response[404]({ message: "The selected project is unavailable." });

        if (project.disabled)
            return response.sendResponse({
                success: false,
                message: "The project is temporarily unavailable!"
            }, 200);

        const investmentTerm = await getInvestmentTermById(term);

        if (!investmentTerm)
            return response[404]({ message: "The selected investment term is unavailable!" });

        if (investmentTerm.disabled)
            return response[404]({ message: "The selected investment term is temporarily unavailable!" });

        const wallet = await getWalletByTenantId(tenantId);

        if (!wallet)
            return response[404]({ message: "You do not have a wallet!" });

        if (wallet.balance < amount)
            return response.sendResponse({
                success: false,
                message: "Insufficient balance!"
            }, 200);

        const dueGain = (amount * investmentTerm.benefit) / 100;
        const collectionDate = addMonthsToDate(new Date(), investmentTerm.term);

        await registerInvestment({
            amount, projectId, term,
            funder: tenantId,
            dueAmount: dueGain + amount,
            dueGain, collectionDate
        });
        logger(`New investment registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        await registerTransaction({
            amount,
            recipient: masterWalletId,
            sender: tenantId,
            reason: "Investment",
            paymentMethodTypeCodename: "CLFW",
            transactionId: randomUUID(),
            currency: "USD",
            status: appConfig.transaction.status.ACCEPTED
        });
        logger(`New transaction registered successfully. Recipient wallet: ${masterWalletId}, sender: ${tenantId}`)

        const senderBalance = wallet.balance - amount;
        const recipientBalance = Number(masterWallet.balance) + amount;

        await updateWallet(wallet.id, { balance: senderBalance });
        await updateWallet(masterWallet.id, { balance: recipientBalance });

        response[201]({ message: "Investment registered successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while registering the investment." });
        }
    }

};
