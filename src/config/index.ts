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
    SERVICE_ID: "VA2638596ac85433b09755508af9b171ea",
    ACCOUNT_SID: "ACacb10c996194dfc5f8890e14b1e8dc32",
    AUTH_TOKEN: "c14a0b98a503ae708d0bb288d8bc2cac",
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
        "retriveByWallet": "transactions/retrive/wallet/:id/:page?/:perPage?",
        "list": "transactions/list/:page?/:perPage?",
        "create": "transactions/create/",
        "update": "transactions/update/:id",
        "delete": "transactions/delete/:id",
        "deleteByWallet": "transactions/delete/wallet/:id",
        "purge": "transactions/purge/",
    },
    "company": {
        "retrive": "companies/retrive/:id",
        "retriveByUser": "companies/retrive/manager/:id/:page?/:perPage?",
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

    "auth": {
        "signin": 'oauth/sign-in', // send auth code after login with credentials
        "signup": 'oauth/sign-up',
        "getAccessToken": "oauth/token/access-token", // get access token with code verifier
        "refreshAccessToken": "oauth/token/refresh-token", // get new access token with refresh token
        "resetPasswordVerify": "oauth/reset-password/verify-user",
        "resetPasswordReset": "oauth/reset-password/reset",
        "twoFAVerify": "oauth/two-fa/verify-user",
        "twoFACheck": "oauth/two-fa/check-verification",
        "verifyUserInfo": "oauth/verify-info",
        "checkVerification": "oauth/check-verification",
    },
}

export const paginationConfig = {
    defaultPage: 1,
    defaultPerPage: 15,
}

