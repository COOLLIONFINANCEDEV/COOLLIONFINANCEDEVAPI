import * as dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_USER: "root",
    DB_PASSWORD: "root",
    DB_NAME: "coollionfidev",
};

export const server = {
    port: 8000,
    host: "127.0.0.1",
};


export const corsAllowOrigin = {
    origin: "http://localhost:8081",
};


export const twilioConfig = {
    SERVICE_ID: "VAe67e23df675d674c93422530206e04bd",
    ACCOUNT_SID: "AC75abb9a086c1f5c4b395c62c1a566638",
    AUTH_TOKEN: "a32fa61f7b6f7742540b7ddcdd507f38",
}


export const endpoints = {
    "baseUrl": "api",
    "users": {
        "retrive": "users/retrive/:id",
        "list": "users/list/:page?/:perPage?",
        "create": "users/create/",
        "update": "users/update/:id",
        "delete": "users/delete/:id",
        "purge": "users/purge/",
    },

    "userDocs": {
        "retrive": "users-docs/retrive/:id",
        "retriveByUser": "users-docs/retrive/user/:id/:page?/:perPage?",
        "list": "users-docs/list/:page?/:perPage?",
        "create": "users-docs/create/",
        "update": "users-docs/update/:id",
        "delete": "users-docs/delete/:id",
        "deleteByUser": "users-docs/delete/user/:id",
        "purge": "users-docs/purge/",
    },

    "role": {
        "retrive": "role/retrive/:id",
        "list": "role/list/:page?/:perPage?",
        "create": "role/create/",
        "update": "role/update/:id",
        "delete": "role/delete/:id",
        "purge": "role/purge/",
    },

    "permissions": {
        "retrive": "permissions/retrive/:id",
        "list": "permissions/list/:page?/:perPage?",
        "create": "permissions/create/",
        "update": "permissions/update/:id",
        "delete": "permissions/delete/:id",
        "purge": "permissions/purge/",
    },

    "wallet": {
        "retrive": "wallet/retrive/:id",
        "retriveByUser": "wallet/retrive/user/:id",
        "list": "wallet/list/:page?/:perPage?",
        "create": "wallet/create/",
        "update": "wallet/update/:id",
        "delete": "wallet/delete/:id",
        "deleteByUser": "wallet/delete/user/:id",
        "purge": "wallet/purge/",
    },

    "transactions": {
        "retrive": "transactions/retrive/:id",
        "retriveByWallet": "transactions/retrive/wallet/:id",
        "list": "transactions/list/:page?/:perPage?",
        "create": "transactions/create/",
        "update": "transactions/update/:id",
        "delete": "transactions/delete/:id",
        "deleteByWallet": "transactions/delete/wallet/:id",
        "purge": "transactions/purge/",
    },
    "company": {
        "retrive": "companies/retrive/:id",
        "list": "companies/list/:page?/:perPage?",
        "create": "companies/create/",
        "update": "companies/update/:id",
        "delete": "companies/delete/:id",
        "purge": "companies/purge/",
    },
    "offer": {
        "retrive": "offers/retrive/:id",
        "list": "offers/list/:page?/:perPage?",
        "create": "offers/create/",
        "update": "offers/update/:id",
        "delete": "offers/delete/:id",
        "purge": "offers/purge/",
    },

    "offerDocs": {
        "retrive": "offer-docs/retrive/:id",
        "retriveByOffer": "offer-docs/retrive/offer/:id/:page?/:perPage?",
        "list": "offer-docs/list/:page?/:perPage?",
        "create": "offer-docs/create/",
        "update": "offer-docs/update/:id",
        "delete": "offer-docs/delete/:id",
        "deleteByOffer": "offer-docs/delete/offer/:id",
        "purge": "offer-docs/purge/",
    },

    "offerRepaymentPlan": {
        "retrive": "offer-repayment-plan/retrive/:id",
        "retriveByOffer": "offer-repayment-plan/retrive/offer/:id/:page?/:perPage?",
        "list": "offer-repayment-plan/list/:page?/:perPage?",
        "create": "offer-repayment-plan/create/",
        "update": "offer-repayment-plan/update/:id",
        "delete": "offer-repayment-plan/delete/:id",
        "deleteByOffer": "offer-repayment-plan/delete/offer/:id",
        "purge": "offer-repayment-plan/purge/",
    },

    "investment": {
        "retrive": "investment/retrive/:id",
        "retriveByOffer": "investment/retrive/offer/:id/:page?/:perPage?",
        "retriveByWallet": "investment/retrive/wallet/:id/:page?/:perPage?",
        "list": "investment/list/:page?/:perPage?",
        "create": "investment/create/",
        "update": "investment/update/:id",
        "delete": "investment/delete/:id",
        "deleteByOffer": "investment/delete/offer/:id",
        "deleteByWallet": "investment/delete/wallet/:id",
        "purge": "investment/purge/",
    },

    "twoFACode": {
        "send": "two-fa/send",
        "check": "two-fa/check",
        // "validate": "two-fa/validate",
    },

    "auth": {
        "login": 'oauth/login', // send auth code after login with credentials
        "getAccessToken": "oauth/token/access-token", // get access token with code verifier
        "refreshAccessToken": "oauth/token/refresh-token", // get new access token with refresh token
    },
}

export const paginationConfig = {
    defaultPage: 1,
    defaultPerPage: 15,
}

