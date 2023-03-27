import { Transaction } from "@prisma/client";
import axios from "axios";
import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { app as appConfig } from "../configs/app.conf";
import { hasher as hasherConfig } from "../configs/utils.conf";
import { getAllTransactions, getTransactionById, getTransactionByTransId, registerTransaction, updateTransaction } from "../services/transaction.service";
import { getWalletByTenantId, updateWallet } from "../services/wallet.service";
import { ICustomRequest } from "../types/app.type";
import Hasher from "../utils/hasher.helper";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:transaction:list');

    try {
        const { tenantId } = req.auth!;
        const { otherId, page, perPage } = req.params;

        if (otherId && isNaN(Number(otherId)))
            return response[400]({ message: 'Invalid query parameter otherId.' });

        const transactions = await getAllTransactions({
            where: {
                OR: [
                    { sender: Number(otherId) || tenantId },
                    { recipient: Number(otherId) || tenantId },
                ]
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
        const wallet = await getWalletByTenantId(tenantId);

        if (!wallet)
            return response[400]({ message: "You do not have a wallet!", });

        await registerTransaction({
            status: appConfig.transaction.status.PENDING,
            sender: tenantId,
            recipient: tenantId,
            reason: "Deposit on my wallet account",
            ...req.body
        });
        logger(`New transaction registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        response[201]({ message: "Transaction in treatement." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
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
                    const statusCode = transactionStatus[statusConstant];

                    if (statusCode !== transaction.status) {
                        updateTransaction(transaction.id, {
                            status: statusCode,
                            operator: body.payment_method,
                            phone: `+${body.cpm_phone_prefixe}${body.cel_phone_num}`,
                        });

                        if (statusCode === transactionStatus["ACCEPTED"]) {
                            const wallet = await getWalletByTenantId(transaction.recipient);

                            if (wallet)
                                await updateWallet(wallet.id, { balance: wallet.balance + transaction.amount });
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
