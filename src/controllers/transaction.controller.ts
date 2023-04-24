import { Transaction } from "@prisma/client";
import axios from "axios";
import debug from "debug";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { abilitiesFilter } from "../abilities/filter.ability";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig, twilio as twilioConfig } from "../configs/utils.conf";
import { registerInvestment, updateInvestment } from "../services/investment.service";
import { getAllTransactions, getTransactionById, getTransactionByTransId, registerTransaction, updateTransaction } from "../services/transaction.service";
import { ICustomRequest } from "../types/app.type";
import Hasher from "../utils/hasher.helper";
import { jwtErrorHandler } from "../utils/jwt-error.helper";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";
import sgSendEmail from "../utils/send-email.helper";

const constants = appConfig.constants;


export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:transaction:list');

    try {
        const { tenantId } = req.auth!;
        const { otherId, page, perPage } = req.params;
        let status = undefined;

        if (otherId) {
            if (isNaN(Number(otherId)))
                return response[400]({ message: 'Invalid query parameter otherId.' });
            else status = {
                status: {
                    gte: appConfig.transaction.status.ACCEPTED
                }
            };
        }

        const transactions = await getAllTransactions({
            where: {
                OR: [
                    { sender: Number(otherId) || tenantId },
                    { recipient: Number(otherId) || tenantId },
                ],
                ...status
            },
            page: Number(page), perPage: Number(perPage)
        });
        const filteredTransactions = await abilitiesFilter({
            subject: "Transaction",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: transactions,
            selfInput: false
        }, ({ subject, action, abilities, input }) => {
            const filteredInput = input.map((transaction) => {
                const filteredValue: Record<string, any> = {};

                Object.keys(transaction).forEach((item) => {
                    const testOwner = transaction.sender === tenantId || transaction.recipient === tenantId;
                    item = testOwner ? item : `${item}Other`;
                    if (abilities.can(action!, subject, item))
                        filteredValue[item] = transaction[item as keyof Transaction];
                });

                return filteredValue as Transaction;
            });

            return filteredInput;
        });
        const finalTransactions = await outItemFromList(filteredTransactions);

        response[200]({ data: finalTransactions });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:transaction:retrive');

    try {
        const { tenantId } = req.auth!;
        const { transactionId } = req.params;
        const { can } = req.abilities!;

        if (isNaN(Number(transactionId)))
            return response[400]({ message: 'Invalid query parameter transactionId.' });

        const transaction = await getTransactionById(Number(transactionId));

        if (!transaction)
            return response[404]({ message: "Record not found!" });

        const testOwner = transaction.sender === tenantId || transaction.recipient === tenantId;
        const filteredTransaction = await abilitiesFilter({
            subject: "Transaction",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [transaction],
            selfInput: testOwner || can("manage", "Transaction")
        });
        const finalTransaction = await outItemFromList(filteredTransaction);

        response[200]({ data: finalTransaction });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const makeDeposit = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:transaction:makeDeposit');

    try {
        const { userId, tenantId } = req.auth!;
        // const wallet = await getWalletByTenantId(tenantId);

        // if (!wallet)
        //     return response[400]({ message: "You do not have a wallet!", });
        const { investmentResume } = req.body;
        const resume = jwt.verify(investmentResume, appConfig.jwtSecret);

        if (typeof resume === "string") 
            return response[401]({ message: constants.INVALID_TOKEN });

        delete req.body["investmentResume"];

        const transaction = await registerTransaction({
            status: appConfig.transaction.status.PENDING,
            sender: tenantId,
            recipient: tenantId, // TODO: Change recipiant
            reason: "investment", // do not change the reason value
            amount: resume.amount,
            ...req.body
        });
        logger(`New transaction registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        await registerInvestment({ ...investmentResume, done: false, transactionId: transaction.transactionId });
        logger(`New investment registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        response[201]({
            message: "Transaction in processing, you will receive an email once completed.",
        });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            const jwtError = jwtErrorHandler(err);

            if (jwtError)
                return response[401]({ message: jwtError });

            response[500]({ message: "An error occurred while making deposite." });
        }
    }

};


export const syncCinetpayPayment = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:transaction:syncCinetpayPayment');
    const body = req.body;

    try {
        if (req.method === 'POST') {
            const hasher = new Hasher(hasherConfig.hashSecretKey);
            const cmp = body.cpm_site_id + body.cpm_trans_id + body.cpm_trans_date + body.cpm_amount + body.cpm_currency + body.signature +
                body.payment_method + body.cel_phone_num + body.cpm_phone_prefixe + body.cpm_language + body.cpm_version
                + body.cpm_payment_config + body.cpm_page_action + body.cpm_custom + body.cpm_designation + body.cpm_error_message;
            const token = hasher.hashToken(cmp);
            const verifiedToken = req.headers['x-token'];

            if (verifiedToken === token) {
                const transaction = await getTransactionByTransId(body.cpm_trans_id);

                if (transaction) {
                    const payload = {
                        apikey: appConfig.transaction.services.cinetpay.apiKey,
                        site_id: appConfig.transaction.services.cinetpay.siteId,
                        transaction_id: transaction.transactionId
                    };
                    const responseData = await axios.post("https://api-checkout.cinetpay.com/v2/payment/check",
                        payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const { data } = responseData.data;
                    const transactionStatus = appConfig.transaction.status;
                    const statusConstant = data.status as keyof typeof transactionStatus;
                    const status = transactionStatus[statusConstant];

                    if (status !== transaction.status) {
                        updateTransaction(transaction.id, {
                            status: status,
                            operator: body.payment_method,
                            customerPhoneNumber: `+${body.cpm_phone_prefixe}${body.cel_phone_num}`,
                        });

                        if (status === transactionStatus["ACCEPTED"]) {
                            // const wallet = await getWalletByTenantId(transaction.recipient);

                            // if (wallet)
                            //     await updateWallet(wallet.id, { balance: wallet.balance + transaction.amount });

                            if (transaction.reason === "investment") {
                                await updateInvestment({ transactionId: transaction.transactionId }, { done: true });

                                const funder = transaction.senderTenant;
                                const to = funder.email || funder.email2;

                                if (to)
                                    await sgSendEmail({
                                        to,
                                        from: {
                                            name: `${twilioConfig.defaultOptions.from.name} Investment Team`,
                                            email: appConfig.contacts.business
                                        },
                                        templateId: twilioConfig.templateIDs.acceptTransaction,
                                        dynamicTemplateData: {
                                            amount: transaction.amount,
                                            greeting: `Dear ${funder.name || "User"},`
                                        }
                                    });

                            }
                        } else if (status <= transactionStatus["REJECTED"]) {
                            const funder = transaction.senderTenant;
                            const to = funder.email || funder.email2;

                            if (transaction.reason === "investment" && to)
                                await sgSendEmail({
                                    to,
                                    from: {
                                        name: `${twilioConfig.defaultOptions.from.name} Investment Team`,
                                        email: appConfig.contacts.business
                                    },
                                    templateId: twilioConfig.templateIDs.rejectTransaction,
                                    dynamicTemplateData: {
                                        amount: transaction.amount,
                                        greeting: funder.name || "Dear User"
                                    }
                                });

                        }
                    }
                }
            }
        }

        response[200]();
    } catch (err) {
        logger(err);
        response[500]();
    }
};
