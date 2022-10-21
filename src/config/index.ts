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
}

export const paginationConfig = {
    defaultPage: 1,
    defaultPerPage: 15,
}

