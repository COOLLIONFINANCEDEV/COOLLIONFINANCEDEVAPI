import dotenv from "dotenv";

dotenv.config();

export const app = {
    version: "v2",
    jwtSecret: String(process.env.JWT_SECRET),
    appName: "Cool Lion Finance",
    appBaseUrl: "https://app.coollionfi.com/login",
    teamContact: "contact@coollionfi.com",

    /** 5 minutes */
    tokenExpirationTime: 5 * 60,

    /** 1 hours */
    sessionExpirationTime: 60 * 60,
    baseUserRoleName: String(process.env.BASE_USER_ROLE),

    /** 4 */
    walletMaxPaymentMethods: 4,
    masterWalletId: Number(process.env.MASTER_WALLET_ID),
    communityMemberRoleId: Number(process.env.COMMUNITY_MEMBER_ROLE_ID),

    /** 300 */
    minimumToInvest: 300,

    /** as much as possible */
    maximumToInvest: undefined,

    pagination: {
        /** 1 */
        page: 1,

        /** 10 */
        perPage: 10
    },

    redisKeys: {
        revokedUserSession: "revokedUserSession"
    },

    transaction: {
        status: {
            REJECTED: -1,
            PENDING: 0,
            ACCEPTED: 1,

            // Cinetpay
            // PENDING: 0,
            SUCCESS: 1,
            REFUNDED: 2,
            CANCELLED: -1,
            FAILED: -2,
            EXPIRED: -3,

            // Stripe
            SUCCEEDED: 1,
            // PENDING: 0,
            // FAILED: -2,
            CANCELED: -1,
            // REFUNDED: 2,
            PARTIALLY_REFUNDED: 3,
        },
        services: {
            cinetpay: {
                apiKey: String(process.env.CINETPAY_API_KEY),
                siteId: String(process.env.CINETPAY_SITE_ID),
                password: String(process.env.CINETPAY_PASSWORD),
                secretKey: String(process.env.CINETPAY_SECRET_KEY),
            }
        }
    },

    constants: {
        TOKEN_EXPIRED: "Token expired",
        INVALID_TOKEN: "Invalid token",
        AUTH_HEADER_MISSED: "Missing authorization header",
        ERR_BEARER_TOKEN: "Invalid authorization header",
        COMPROMISED_SESSION: "Session possibly compromised.",
        ERR_REVOKED_SESSION: "Session revoked, re login required!",
        EXP_SESSION: "Session expired.",
        ERR_AUTH_RULES: "Invalid authorization rules",
        ACCESS_DENIED: "Access denied",
        ANY_FIELD: "any field",
        LOGGED: "logged"
    }
}