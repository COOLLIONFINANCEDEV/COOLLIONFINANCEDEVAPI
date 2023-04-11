import dotenv from 'dotenv';

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
        from: { name: "Cool Lion Team", email: "dev@coollionfi.com" },
        templateId: "d-83839b67e6d340da92ae57b79beee9bd",
    },
    serviceID: String(process.env.SERVICE_ID),
    accountSID: String(process.env.ACCOUNT_SID),
    authToken: String(process.env.AUTH_TOKEN),
    sendGridApiKey: String(process.env.SG_APIKEY),
    templateIDs: {
        accountActivation: "d-6467621fc15440c18fb32b269b64d507",
        invitation: "d-6467621fc15440c18fb32b269b64d507",
        communityInvitation: "d-6467621fc15440c18fb32b269b64d507",
    }
}

export const redis = {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT),
    password: String(process.env.REDIS_PASSWORD),
}