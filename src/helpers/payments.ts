import axios from "axios";
import { addContactData, getPaymentUrlData, transferMoneyDate } from "src/types/cinetpay_types";
import { cinetpayConfig } from "src/config/index";
import { v4 as uuidv4 } from 'uuid';
import check_uuidv4 from "./check_uuidv4";
import validator from "validator";


export class Cinetpay {

    /**
     * 
     * @param data 
     */
    async get_payment_url(data: getPaymentUrlData) {

        data.apikey = cinetpayConfig.API_KEY;
        data.site_id = cinetpayConfig.SITE_ID;
        data.transaction_id = check_uuidv4(data.transaction_id) ? data.transaction_id : uuidv4();
        data.notify_url = validator.isURL(cinetpayConfig.NOTIFY_URL, {
            protocols: ["https"],
            require_protocol: true,
            require_valid_protocol: true
        }) ? cinetpayConfig.NOTIFY_URL : data.notify_url;
        data.return_url = validator.isURL(cinetpayConfig.RETURN_URL, {
            protocols: ["https"],
            require_protocol: true,
            require_valid_protocol: true
        }) ? cinetpayConfig.RETURN_URL : data.return_url;
        data.channels = data.channels || "ALL";
        data.invoice_data = data.invoice_data ? data.invoice_data : {
            "ID transaction": data.transaction_id,
            "Motif": "Rechargement de compte",
            "Contact": "contact@coollionfi.com | +225 077 973 3465",
        };


        const config = {
            method: 'post',
            url: 'https://api-checkout.cinetpay.com/v2/payment',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(function (response) {
                const data = response.data;

                if (data.message === "CREATED") {
                    return data.data
                } else {
                    return {
                        error: true,
                        message: data.description
                    }
                }
            })
            .catch(function (error: any) {
                throw error;
            });

    }


    async verify_payment(transaction_id: string) {

        const data = {
            'apikey': cinetpayConfig.API_KEY,
            'site_id': cinetpayConfig.SITE_ID,
            'transaction_id': transaction_id
        }
        const config = {
            method: 'post',
            url: 'https://api-checkout.cinetpay.com/v2/payment/check',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data;

                if (data.code === "00" && data.message === "SUCCES" && data.status === "ACCEPTED") {
                    return {
                        error: false,
                        data: data.data,
                    }
                } else {
                    return {
                        error: true,
                        message: data.message,
                        data: data.data,
                    }
                }
            })
            .catch(function (error: any) {
                throw error;
            });
    }


    async generate_transfer_token() {
        const data = {
            apikey: cinetpayConfig.API_KEY,
            password: cinetpayConfig.PASSWORD,
        }
        const config = {
            method: 'post',
            url: 'https://client.cinetpay.com/v1/auth/login?lang=fr',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data

                if (data.code === 0 && data.message === "OPERATION_SUCCES") {
                    return {
                        error: false,
                        token: data.data.token
                    }
                } else {
                    return {
                        error: true,
                        message: data.description
                    }
                }

            })
            .catch(function (error: any) {
                throw error;
            });
    }


    async get_balance(token: String) {
        const config = {
            method: 'get',
            url: 'https://client.cinetpay.com/v1/transfer/check/balance?token=' + token,
            headers: {
                'Content-Type': 'application/json'
            },
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data;

                if (data.code === 0 && data.message === "OPERATION_SUCCES") {
                    return {
                        error: false,
                        data: data.data,
                    }
                } else {
                    return {
                        error: true,
                        messag: data.description,
                    }
                }

            })
            .catch(function (error: any) {
                throw error;
            });
    }


    async add_contact({ token, data }: { token: string; data: addContactData; }) {
        const config = {
            method: 'post',
            url: `https://client.cinetpay.com/v1/transfer/contact?token=${token}&lang=fr`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data;

                if (data.code === 0 && data.message === "OPERATION_SUCCES" && data.status === "success") {
                    return {
                        error: false,
                        data: data.data[0],
                    }
                } else {
                    return {
                        error: true,
                        message: data.description,
                    }
                }
            })
            .catch(function (error: any) {
                throw error;
            });
    }


    async money_transfer({ token, data }: { token: String; data: transferMoneyDate; }) {
        data.client_transaction_id = check_uuidv4(data.client_transaction_id) ? data.client_transaction_id : uuidv4();
        data.notify_url = validator.isURL(cinetpayConfig.TRANSFER_NOTIFY_URL, {
            protocols: ["https"],
            require_protocol: true,
            require_valid_protocol: true
        }) ? cinetpayConfig.TRANSFER_NOTIFY_URL : data.notify_url;

        const config = {
            method: 'get',
            url: `https://client.cinetpay.com/v1/transfer/money/send/contact?token=${token}&lang=fr`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data;

                if (data.code === 0 && data.message === "OPERATION_SUCCES") {
                    return {
                        error: false,
                        data: data.data[0],
                    }
                } else {
                    return {
                        error: true,
                        message: data.description,
                    }
                }

            })
            .catch(function (error: any) {
                throw error;
            });
    }


    async check_transfer({ token, client_transaction_id }: { token: String; client_transaction_id: String; }) {
        const config = {
            method: 'get',
            url: `https://client.cinetpay.com/v1/transfer/check/money?token=${token}&client_transaction_id =${client_transaction_id }`,
            headers: {
                'Content-Type': 'application/json'
            },
        };

        return axios(config)
            .then(function (response: any) {
                // return JSON.stringify(response.data)
                const data = response.data;

                if (data.code === 0 && data.message === "OPERATION_SUCCES") {
                    return {
                        error: false,
                        data: data.data[0],
                    }
                } else {
                    return {
                        error: true,
                        message: data.description,
                    }
                }
            })
            .catch(function (error: any) {
                throw error;
            });
    }
}

