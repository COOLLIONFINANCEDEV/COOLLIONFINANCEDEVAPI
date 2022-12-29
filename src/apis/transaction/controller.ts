import { Request, Response } from 'express';

import check_req_body from 'src/helpers/check_req_body';
import error_404 from 'src/middlewares/error_404';
import Service from 'src/apis/transaction/services';
import UserService from 'src/apis/users/services';
import serializer from 'src/middlewares/data_serializer';
import error_foreign_key_constraint from 'src/middlewares/error_foreign_key_constraint';
import error_duplicate_key_constraint from 'src/middlewares/error_duplicate_key_constraint';
import make_response from 'src/helpers/make_response';
import validator from 'validator';
import { cinetpayConfig, paginationConfig } from 'src/config';
import { Cinetpay } from 'src/helpers/payments';
import { getPaymentUrlData } from 'src/types/cinetpay_types';
import { transaction } from '@prisma/client';
import customTransaction from 'src/types/transaction';
import check_type_and_return_any from 'src/helpers/check_type_and_return_any';
import Hasher from 'src/helpers/hasher';
import sg_send_email from 'src/helpers/send_email';

const service = new Service();
const userService = new UserService();
const cinetpay = new Cinetpay();

// const { check_body } = require("../utils/check_body.js");
// import Hasher from "helpers/hasher";
// import Service from 'apis/transaction/service'

// const Service = new UserServices(undefined, 'transaction');


// Create and Save a new transaction
export const deposit = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float',
        currency: 'like=[XOF | XAF | CDF | GNF | USD]',
        use_credit_card: "boolean",
        customer_address: 'not_null, optional', // card - addresse du client
        customer_city: "optional, not_null", // card - La ville du client
        customer_country: 'optional, not_null', // card - le code ISO du pays
        customer_state: 'optional, not_null', //card - le code ISO de l'état ou ou du pays
        customer_zip_code: 'optional, not_null', //card - le code ISO de l'état ou ou du pays
        customer_phone_number: "optional, number", //card - le code ISO de l'état ou ou du pays
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    // data = JSON.stringify({
    //     "apikey": "14047243215ebd680ed0d0c0.07903569",
    //     "site_id": '622120',
    //     "transaction_id":  Math.floor(Math.random() * 100000000).toString(), //
    //     "amount": 100,
    //     "currency": "XOF",
    //     "alternative_currency": "",
    //     "description": " TEST INTEGRATION ",
    //     // "customer_id": "172",
    //     "customer_name": "KOUADIO",
    //     "customer_surname": "Francisse",
    //     "customer_email": "harrissylver@gmail.com",
    //     "customer_phone_number": "+225004315545",
    //     "customer_address": "Antananarivo",
    //     "customer_city": "Antananarivo",
    //     "customer_country": "CM",
    //     "customer_state": "CM",
    //     "customer_zip_code": "065100",
    //     "notify_url": "https://webhook.site/b7e1f738-6c07-4ecb-b4ad-9868c04fc1fb",
    //     "return_url": "https://webhook.site/b7e1f738-6c07-4ecb-b4ad-9868c04fc1fb",
    //     "channels": "ALL",
    //     // "metadata": "user1",
    //     // "lang": "FR",
    //     // "invoice_data": {
    //     //   "Donnee1": "",
    //     //   "Donnee2": "",
    //     //   "Donnee3": ""
    //     // }
    //   });


    try {

        const user = await userService.retrive(res.locals.auth.user_id);

        if (!error_404(user, res)) return;

        const wallet = user?.wallet;

        const resolve_scope = () => {
            if (data.use_credit_card) {
                if (data.customer_address && data.customer_city && data.customer_country && data.customer_zip_code && data.customer_state) {
                    if (user?.contact_verified && user?.last_name !== "Undefined" && user?.first_name !== "Undefined" && user?.email !== "Undefined") {
                        return {
                            error: false,
                            code: 0,
                            result: {
                                customer_id: wallet?.id != null ? wallet?.id : -1,
                                customer_name: user.last_name,
                                customer_surname: user.first_name,
                                customer_email: user.email,
                                lock_phone_number: true,
                                customer_phone_number: user.contact,
                                customer_address: data.customer_address,
                                customer_city: data.customer_city,
                                customer_country: data.customer_country,
                                customer_state: data.customer_state,
                                customer_zip_code: data.customer_zip_code,
                            }
                        }
                    } else
                        return { error: true, code: 200, message: "complete your profile to use this option !" }
                } else
                    return { error: true, code: 404, message: "Make sure you fill in all the fields!" }
            } else return {
                error: false,
                code: 0,
                result: {
                    customer_id: -1,
                    customer_name: "",
                    customer_surname: "",
                    customer_email: "",
                    customer_phone_number: "",
                    customer_address: "",
                    customer_city: "",
                    customer_country: "",
                    customer_state: "",
                    customer_zip_code: 0,
                }
            }
        }


        const useCreditCard = resolve_scope();

        if (useCreditCard.error) {
            res.status(useCreditCard.code).send(useCreditCard.message);
            return;
        }


        const payment: getPaymentUrlData = {
            apikey: "",
            site_id: 0,
            transaction_id: "",
            amount: data.amount,
            currency: data.currency,
            alternative_currency: "XOF",
            description: "RECHARGEMENT DE COMPTE COOLLION FINANCE",
            notify_url: "",
            return_url: "",
            channels: "ALL",
            lang: "fr",
            metadata: String(user?.id),
            ...useCreditCard.result
        }

        const url = await cinetpay.get_payment_url(payment);

        if (url.error) throw new Error(url.message);

        const newTransaction = check_type_and_return_any<customTransaction>({
            amount: payment.amount,
            currency: payment.currency,
            service: "cinetpay",
            type: "deposit",
            transaction_id: payment.transaction_id,
            wallet_id: wallet != null ? wallet.id : -1,
        });

        await service.create(newTransaction);
        res.status(201).send(make_response(false, { payment_url: url.payment_url }));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(500).send(make_response(true, "Internal Server Error!"));
        if (process.env.DEBUG) throw e;
    }
}


// Withdraw
export const withdrawal = async (req: Request, res: Response) => {
    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: "float",
        use_existing_phone_number: "boolean",
        phone_prefix: 'optional, number', //card - le code ISO de l'état ou ou du pays
        phone_number: "optional, number", //card - le code ISO de l'état ou ou du pays
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        // Generation du token de transfert
        const generateToken = await cinetpay.generate_transfer_token();

        if (generateToken.error) throw new Error(generateToken.message);

        // solde du compte de transfert : optionel

        // Ajout du contact receveur du transfert à notre liste de contact de transfert
        const userId = res.locals.auth.user_id;
        let customerPhonePrefix: string = "225";
        let customerPhoneNumber: string;
        const customer = await userService.retrive(userId);
        const customerBalance = customer?.wallet?.amount ? Number(customer?.wallet?.amount) : 0;

        if (customerBalance < data.amount) {
            res.send(make_response(true, `The amount you want to withdraw exceed your balance ! Your balance: ${customerBalance}`));
            return;
        }


        if (data.use_existing_phone_number) {

            if (!customer?.contact_verified) {
                res.send(make_response(true, "Complete your contact on your profile to use this option"));
                return;
            }

            customerPhoneNumber = customer.contact;
        } else {
            if (!Number(data.phone_prefix) || !Number(data.phone_number)) {
                res.status(400).send(make_response(true, "Give a right phone number and prefix or use your profile phone number with set to true use_existing_phone_number"));
                return;
            }

            customerPhonePrefix = data.phone_prefix;
            customerPhoneNumber = data.phone_number;
        }

        // [{ "prefix": "221", "phone": "777396921", "name": "Cédric", "surname": "S", "email": "email@example.com" }]
        const addContact = await cinetpay.add_contact({
            token: generateToken.token,
            data: {
                prefix: Number(customerPhonePrefix),
                phone: customerPhoneNumber,
                name: String(customer?.last_name),
                surname: String(customer?.first_name),
                email: String(customer?.email),
            }
        });

        if (addContact.error) throw new Error(addContact.message);

        // Transfert

        const transfer = await cinetpay.money_transfer({
            token: generateToken.token,
            data: {
                prefix: Number(customerPhonePrefix),
                phone: customerPhoneNumber,
                amount: data.amount,
                client_transaction_id: "",
                notify_url: "",
            }
        });

        if (transfer.error) throw new Error(transfer.message);

        const newTransaction = check_type_and_return_any<customTransaction>({
            amount: transfer.data.amount,
            currency: "XOF",
            service: "cinetpay",
            type: "withdrawal",
            transaction_id: transfer.data.transaction_id,
            wallet_id: Number(customer?.wallet?.id),
        });

        await service.create(newTransaction);
        res.status(201).send(make_response(false, { status: "pending" }));

    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_duplicate_key_constraint(res, e, service.get_prisma())) return;
        res.status(500).send(make_response(true, "Internal Server Error!"));
        if (process.env.DEBUG) throw e;
    }
}


// Update and Save a new transaction
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate request
    if (!check_req_body(req, res)) return;

    let data = req.body;

    const result = serializer(data, {
        amount: 'not_null, float, optional',
        type: "not_null, optional",
        status: "not_null, optional",
        wallet_id: "not_null, integer, optional",
        is_deleted: "not_null, boolean, optional"
    });

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    data = result.result;

    try {
        const update = await service.update(Number(id), res.locals.auth?.user_id, data);
        res.send(make_response(false, update));
    } catch (e) {
        if (!error_foreign_key_constraint(res, e, service.get_prisma())) return;
        if (!error_404(e, res)) return;
        throw e;
    }
}


// get all transaction from the database (with condition).
export const findAll = async (req: Request, res: Response) => {
    let page: string | number = String(req.params.page);
    let perPage: string | number = String(req.params.perPage);

    page = validator.isNumeric(page) ? Number(page) : paginationConfig.defaultPage;
    perPage = validator.isNumeric(perPage) ? Number(perPage) : paginationConfig.defaultPerPage;

    const transaction = await service.get({ page: page, perPage: perPage });

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Retrive transaction
export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await service.retrive(Number(id), res.locals.auth?.user_id);

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Retrive transaction by user
export const findByWallet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await service.retriveByWallet(Number(id), res.locals.auth?.user_id);

    if (!error_404(transaction, res)) return;

    res.send(make_response(false, transaction));
};


// Soft delete transaction
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const transaction = await service.remove(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, transaction));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft delete transaction by user
export const removeByWallet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await service.deleteByWallet(Number(id), res.locals.auth?.user_id);
        res.send(make_response(false, result));
    } catch (e) {
        if (!error_404(e, res)) return;
        throw e;
    }
};


// Soft purge transaction
export const removeAll = async (req: Request, res: Response) => {
    const transaction = await service.deleteAll("transaction");

    res.send(make_response(false, transaction));
};



// Payment notify url
export const cinetpay_payment_notification_url = async (req: Request, res: Response) => {
    if (!check_req_body(req, res)) return;

    let data = req.body;

    // const result = serializer(data, {
    //     cpm_site_id: "not_null, number",
    //     cpm_trans_id: "not_null",
    //     cpm_trans_date: "not_null",
    //     cpm_amount: "not_null, float",
    //     cpm_currency: "or=[XOF | XAF | CDF | GNF | USD]",
    //     signature: "not_null",
    //     payment_method: "not_null",
    //     cel_phone_num: "number",
    //     cpm_phone_prefixe: "number",
    //     cpm_language: "not_null",
    //     cpm_version: "not_null",
    //     cpm_payment_config: "not_null",
    //     cpm_page_action: "not_null",
    //     cpm_custom: "not_null",
    //     cpm_designation: "not_null",
    //     cpm_error_message: "",
    // });

    // if (result.error) {
    //     res.status(400).send(result);
    //     return;
    // }

    // data = result.result;


    try {
        const cmp = data.cpm_site_id + data.cpm_trans_id + data.cpm_trans_date + data.cpm_amount + data.cpm_currency +
            data.signature + data.payment_method + data.cel_phone_num + data.cpm_phone_prefixe +
            data.cpm_language + data.cpm_version + data.cpm_payment_config + data.cpm_page_action + data.cpm_custom + data.cpm_designation + data.cpm_error_message;

        const hmac = Hasher.hmac(cmp, "SHA256", cinetpayConfig.SECRET_KEY);

        if (hmac === req.headers["x-token"]) {
            let transaction = await service.retriveByTransactionID(data.cpm_trans_id);

            if (transaction?.status.toUpperCase() == "ACCEPTED") res.send();
            else {
                const transactionIssue = await cinetpay.verify_payment(data.cpm_trans_id);
                const update = check_type_and_return_any<any>({
                    status: (transactionIssue.data.status).toLowerCase(),
                    method: (transactionIssue.data.payment_method).toLowerCase()
                })
                await service.update(Number(transaction?.id), Number(transaction?.wallet?.user_id), update);
                transaction = await service.retriveByTransactionID(data.cpm_trans_id);
                const balance = transaction?.wallet?.amount;

                const user = await userService.retrive(data.cpm_custom).catch();
                const username = user?.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}` : user?.last_name
                        ? user.last_name : user?.first_name
                            ? user.first_name : "Dear";

                if (transactionIssue.error) {
                    // notify the customer by email that his transaction has been canceled
                    await sg_send_email({
                        to: String(user?.email),
                        templateData: {
                            subject: "Transaction info",
                            title: "TRANSACTION REJECTED",
                            username: username,
                            body: `failed to deposit ${data.cpm_amount}${data.cpm_currency} on your fiat wallet. Try again and if you receive a similar email contact us`,
                        }
                    }).catch();
                } else {
                    // notify the customer by email that his transaction accepted
                    await sg_send_email({
                        to: String(user?.email),
                        templateData: {
                            subject: "Transaction info",
                            title: "TRANSACTION ACCEPTED",
                            username: username,
                            body: `${data.cpm_amount}${data.cpm_currency} deposit on your fiat wallet. New balance is ${balance} XOF`,
                        }
                    }).catch();
                }
            }

            res.send();
        } else res.status(404).send("Hmac token not verified!");
    } catch {
        res.status(500).send();
    }
}

// Money transfer notify url
export const cinetpay_transfer_notification_url = async (req: Request, res: Response) => {
    if (!check_req_body(req, res)) return;

    let data = req.body;

    try {
        let transaction = await service.retriveByTransactionID(data.client_transaction_id);
        
        if (transaction?.status.toUpperCase() == "ACCEPTED") res.send();
        else {
            const generateToken = await cinetpay.generate_transfer_token();

            if (generateToken.error) throw new Error(generateToken.message);

            const transferInfo = await cinetpay.check_transfer({ token: generateToken.token, client_transaction_id: String(transaction?.transaction_id) });

            if (transferInfo.error) throw new Error(transferInfo.message);

            let transferStatus: customTransaction["status"] = "PENDING";

            if (transferInfo.data.treatment_status == "VAL") transferStatus = "ACCEPTED";
            else if (transferInfo.data.treatment_status == "REJ" || transferInfo.data.treatment_status == "RES") transferStatus = "REJECTED";

            const update = check_type_and_return_any<any>({
                status: (transferStatus).toLowerCase(),
                method: (transferInfo.data.operator).toLowerCase()
            })
            
            await service.update(Number(transaction?.id), Number(transaction?.wallet?.user_id), update);
            // transaction = await service.retriveByTransactionID(data.client_transaction_id);
            // const balance = transaction?.wallet?.amount;

            // const user = await userService.retrive(data.cpm_custom).catch();
            // const username = user?.first_name && user.last_name
            //     ? `${user.first_name} ${user.last_name}` : user?.last_name
            //         ? user.last_name : user?.first_name
            //             ? user.first_name : "Dear";

            // if (transactionIssue.error) {
            //     // notify the customer by email that his transaction has been canceled
            //     await sg_send_email({
            //         to: String(user?.email),
            //         templateData: {
            //             subject: "Transaction info",
            //             title: "TRANSACTION REJECTED",
            //             username: username,
            //             body: `failed to deposit ${data.cpm_amount}${data.cpm_currency} on your fiat wallet. Try again and if you receive a similar email contact us`,
            //         }
            //     }).catch();
            // } else {
            //     // notify the customer by email that his transaction accepted
            //     await sg_send_email({
            //         to: String(user?.email),
            //         templateData: {
            //             subject: "Transaction info",
            //             title: "TRANSACTION ACCEPTED",
            //             username: username,
            //             body: `${data.cpm_amount}${data.cpm_currency} deposit on your fiat wallet. New balance is ${balance} XOF`,
            //         }
            //     }).catch();
            // }

        }
    } catch {
        res.status(500).send();
    }
}

