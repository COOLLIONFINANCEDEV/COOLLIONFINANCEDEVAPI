import dotenv from 'dotenv';
import { app as appConfig } from './app.conf';

dotenv.config();

export const hasher = {
    hashSecretKey: String(process.env.HASH_SECRET_KEY),
    defaultOptions: {
        hashAlgorithm: 'sha512',
        hashLength: 64,
        saltLength: 32,
        pbkdf2Iterations: 100000,
    }
}

export const twilio = {
    defaultOptions: {
        from: { name: "Cool Lion Team", email: appConfig.contacts.info },
        templateId: "d-83839b67e6d340da92ae57b79beee9bd",
    },
    serviceID: String(process.env.SERVICE_ID),
    accountSID: String(process.env.ACCOUNT_SID),
    authToken: String(process.env.AUTH_TOKEN),
    sendGridApiKey: String(process.env.SG_APIKEY),
    templateIDs: {
        accountActivation: "d-2bf39b1d1e524c299d519bff79de5cb5",
        invitation: "d-b882140a9bbe4e2b84f64ffbbbf93679",
        acceptTransaction: "d-0889c2f6d1d34b0cb88f56057d73c7e6",
        rejectTransaction: "d-65e331c309284891a25b31f3d11d4628",
    }
}

export const redis = {
    // host: String(process.env.REDIS_HOST),
    // port: Number(process.env.REDIS_PORT),
    // username: String(process.env.REDIS_USER),
    // password: String(process.env.REDIS_PASSWORD),
    connectionString: String(process.env.REDIS_URL),
}