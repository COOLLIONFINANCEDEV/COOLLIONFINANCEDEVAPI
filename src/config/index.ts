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
        "retrive": "user-docs/retrive/:id",
        "list": "user-docs/list/:page?/:perPage?",
        "create": "user-docs/create/",
        "update": "user-docs/update/:id",
        "delete": "user-docs/delete/:id",
        "purge": "user-docs/purge/",
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
}

export const paginationConfig = {
    defaultPage: 1,
    defaultPerPage: 15,
}

