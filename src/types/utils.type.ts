import { TJoiSimplifiedError } from "./app.type"

export interface IResponse {
    success?: boolean,
    message?: string,
    data?: any[],
    errors?: TJoiSimplifiedError[]
};

export type TResponse = IResponse;

interface ICryptoOptions {
    hashAlgorithm?: string;
    hashLength?: number;
    saltLength?: number;
    pbkdf2Iterations?: number;
};

export type TCryptoOptions = ICryptoOptions;

export interface ISGMailData {
    to: string;
    from?: {
        name?: string;
        email: string;
    };
    templateId?: string;
    dynamicTemplateData?: {
        [x: string]: any;
    };
};

export type TSGMailData = ISGMailData;


interface IRedisConnect {
    url?: string;
    username?: string;
    password?: string;
    host?: string;
    port?: number;
    dbNumber?: number;
};

export type TRedisConnect = IRedisConnect;

