import Joi from '@hapi/joi';
import { TEndpoint } from '../types/app.type';
import { isPhoneNumber } from '../utils/validators.helper';


export const user: TEndpoint = {
    list: {
        method: 'get',
        path: '/tenant/:tenantId/user/list:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'User',
            mainRule: true,
        }]
    },
    retriveOther: {
        method: 'get',
        path: '/tenant/:tenantId/user/:userId',
        authorizationRules: [{
            action: "read",
            subject: 'User',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/user',
        authorizationRules: [{
            action: "read",
            subject: 'User',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/user',
        authorizationRules: [{
            action: 'delete',
            subject: 'User',
            mainRule: true,
        }]
    },
    update: {
        method: "put",
        path: "/user/",
        schema: Joi.object({
            firstName: Joi.string().lowercase().trim(),
            lastName: Joi.string().lowercase().trim(),
            email: Joi.string().lowercase().trim().email(),
            phone: Joi.string().lowercase().trim()
                .custom(isPhoneNumber, "Validate phone number"),
            phone2: Joi.string().lowercase().trim()
                .custom(isPhoneNumber, "Validate phone number"),
        }),
        authorizationRules: [{
            action: "update",
            subject: "User",
            fields: ["firstName", "lastName", "email", "phone", "phone2"],
            mainRule: true,
        }]
    },
};

export const tenant: TEndpoint = {
    stats: {
        method: 'get',
        path: 'stats',
    },
    list: {
        method: 'get',
        path: '/tenant/:tenantId/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Tenant',
            mainRule: true,
        }]
    },
    retriveOther: {
        method: 'get',
        path: '/tenant/:tenantId/other/:otherId',
        authorizationRules: [{
            action: "read",
            subject: 'Tenant',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId',
        authorizationRules: [{
            action: "read",
            subject: 'Tenant',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/tenant/:tenantId',
        authorizationRules: [{
            action: 'delete',
            subject: 'Tenant',
            mainRule: true,
        }]
    },
    update: {
        method: "put",
        path: "/tenant/:tenantId",
        schema: Joi.object({
            name: Joi.string().lowercase().trim(),
        }),
        authorizationRules: [{
            action: "update",
            subject: "Tenant",
            fields: ["name"],
            mainRule: true,
        }]
    },
    register: {
        method: 'post',
        path: '/tenant',
        schema: Joi.object({
            accountTypeId: Joi.number().integer().required(),
            name: Joi.string().lowercase().trim().required(),
            email: Joi.string().lowercase().trim().email(),
            email2: Joi.string().lowercase().trim().email(),
            description: Joi.string().lowercase().trim(),
            profilePhoto: Joi.string(),

            // lender
            address: Joi.string(),
            preferredLoanCategories: Joi.string(),

            // borrower
            phone: Joi.string().lowercase().trim()
                .custom(isPhoneNumber, "Validate phone number"),
            phone2: Joi.string().lowercase().trim()
                .custom(isPhoneNumber, "Validate phone number"),
            businessSector: Joi.string().lowercase().trim(),

            // community
            type: Joi.string(),
            website: Joi.string().uri(),
            socialMedia: Joi.array().items(Joi.string().uri()),
        }),
        authorizationRules: [{
            action: "create",
            subject: "Tenant",
            mainRule: true,
        }]
    }
};

export const userTenant: TEndpoint = {
    list: {
        method: 'get',
        path: '/tenant/:tenantId/member/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'UserTenant',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/member/:memberId',
        authorizationRules: [{
            action: "read",
            subject: 'UserTenant',
            mainRule: true,
        }]
    },
    removeMemberRole: {
        method: 'delete',
        path: '/tenant/:tenantId/user-tenant/member/:memberId/remove/role/:roleId',
        authorizationRules: [{
            action: 'delete',
            subject: 'UserTenant',
            mainRule: true
        }]
    },
    removeMember: {
        method: 'delete',
        path: '/tenant/:tenantId/user-tenant/member/:memberId/remove',
        authorizationRules: [{
            action: 'delete',
            subject: 'UserTenant',
            mainRule: true
        }]
    },
    grantRole: {
        method: 'post',
        path: '/tenant/:tenantId/user-tenant/grant-role',
        schema: Joi.object({
            memberId: Joi.number().integer().required(),
            roles: Joi.array().items(Joi.number().integer().required()).required()
        }),
        authorizationRules: [{
            action: 'create',
            subject: 'UserTenant',
            mainRule: true
        }]
    }
};

export const accountTypes: TEndpoint = {
    list: {
        method: 'get',
        path: '/account-type/list',
        authorizationRules: [
            {
                action: "read",
                subject: "AccountType",
                mainRule: true,
            }
        ]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/account-type/:accountTypeId',
        authorizationRules: [
            {
                action: "read",
                subject: "AccountType",
                mainRule: true,
            }
        ]
    },
    update: {
        method: 'put',
        path: '/tenant/:tenantId/account-type/:accountTypeId',
        schema: Joi.object({
            name: Joi.string().lowercase().trim(),
            description: Joi.string().lowercase().trim(),
            restricted: Joi.boolean(),
            excludeRoles: Joi.array().items(Joi.number().integer()),
            addRoles: Joi.array().items(Joi.number().integer()),
        }),
        authorizationRules: [
            {
                action: "update",
                subject: "AccountType",
                fields: ["name", "description", "codename", "restricted"],
                mainRule: true,
            }
        ]
    },
    register: {
        method: 'post',
        path: '/tenant/:tenantId/account-type/',
        schema: Joi.object({
            name: Joi.string().lowercase().trim().required(),
            codename: Joi.string().uppercase().trim().required(),
            description: Joi.string().lowercase().trim(),
            restricted: Joi.boolean(),
            roles: Joi.array().items(Joi.number().integer().required()).required(),
            // permissions: Joi.array().items(Joi.number().integer())
        }),
        authorizationRules: [
            {
                action: "create",
                subject: "AccountType",
                fields: ["name", "description", "codename", "restricted"],
                mainRule: true,
            }
        ]
    }
};

export const role: TEndpoint = {
    list: {
        method: 'get',
        path: '/tenant/:tenantId/role/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Role',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/role/:roleId',
        authorizationRules: [{
            action: "read",
            subject: 'Role',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/tenant/:tenantId/role/:roleId',
        authorizationRules: [{
            action: 'delete',
            subject: 'Role',
            mainRule: true,
        }]
    },
    update: {
        method: 'put',
        path: '/tenant/:tenantId/role/:roleId',
        schema: Joi.object({
            name: Joi.string().lowercase().trim().alphanum().min(3).max(30),
            description: Joi.string().lowercase().trim(),
            newPermissions: Joi.array().items(Joi.number().integer()),
            removePermissions: Joi.array().items(Joi.number().integer()),
            published: Joi.boolean(),
        }),
        authorizationRules: [{
            action: "update",
            subject: "Role",
            fields: ["name", "description", "published"],
            mainRule: true
        }]
    },
    register: {
        method: 'post',
        path: '/tenant/:tenantId/role',
        schema: Joi.object({
            name: Joi.string().lowercase().trim().alphanum().min(3).max(30).required(),
            description: Joi.string().lowercase().trim(),
            permissions: Joi.array().items(
                Joi.number().integer().required(),
                Joi.number().integer().required()).required(),
            published: Joi.boolean().default(false),
        }),
        authorizationRules: [{
            action: "create",
            subject: "Role",
            fields: ["name", "description", "published"],
            mainRule: true
        }]
    }
};

export const auth: TEndpoint = {
    changePassword: {
        method: 'post',
        path: '/auth/change-password',
        schema: Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required()
                .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/)
                .messages({ "string.pattern.base": "Give a strong password for more security." }),
        }),
        authorizationRules: [{
            action: "update",
            subject: "User",
            fields: "password",
            mainRule: true,
        }]
    },
    refreshToken: {
        method: 'post',
        path: '/auth/refresh-access',
        schema: Joi.object({
            refreshToken: Joi.string().lowercase().trim().guid({ version: "uuidv4" }).required(),
            userId: Joi.number().integer().required(),
        })
    },
    login: {
        method: 'post',
        path: '/auth/login',
        schema: Joi.object({
            username: Joi.alternatives()
                .try(
                    Joi.string().lowercase().trim().email(),
                    Joi.string().lowercase().trim()
                        .regex(/(^\+[1-9][0-9]{0,2}[ ]?[0-9]{8,12}$)|(^\+[1-9]{1,2}-[0-9]{3}[ ]?[0-9]{8,12}$)/))
                // .custom(isPhoneNumber, "Validate phone number"))
                .messages({
                    "alternatives.match": "{#label} does not match valide email address or phone number."
                }),
            password: Joi.string(),
            address: Joi.string(),
            magicLink: Joi.string().trim(),
        })
            .with("username", "password")
            .xor("username", "address", "magicLink")
    },
    register: {
        method: 'post',
        path: '/auth/register',
        schema: Joi.object({
            guest: Joi.string().trim(),
            email: Joi.string().lowercase().trim().email(),
            password: Joi.string().required()
                .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/)
                .messages({ "string.pattern.base": "Give a strong password for more security." }),
        }).xor("guest", "email")
    }
};

export const project: TEndpoint = {
    list: {
        method: 'get',
        path: '/project/list/:page?/:perPage?',
        // authorizationRules: [{
        //     action: "read",
        //     subject: 'Project',
        //     mainRule: true,
        // }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/project/:projectId',
        authorizationRules: [{
            action: "read",
            subject: 'Project',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/tenant/:tenantId/project/:projectId',
        authorizationRules: [{
            action: 'delete',
            subject: 'Project',
            mainRule: true,
        }]
    },
    update: {
        method: 'put',
        path: '/tenant/:tenantId/project/:projectId',
        schema: Joi.object({
            title: Joi.string().lowercase().trim().min(3).max(95),
            disabled: Joi.boolean(),
            treat: Joi.boolean(),
        }),
        authorizationRules: [{
            action: "update",
            subject: "Project",
            fields: ["title", "disabled", "treat"],
            mainRule: true
        }]
    },
    register: {
        method: 'post',
        path: '/tenant/:tenantId/project/',
        schema: Joi.object({
            title: Joi.string().lowercase().trim().min(3).max(95).required(),
        }),
        authorizationRules: [{
            action: "create",
            subject: "Project",
            fields: ["title"],
            mainRule: true,
        }]
    }
};

// export const wallet: TEndpoint = {
//     retrive: {
//         method: 'get',
//         path: '/tenant/:tenantId/wallet/',
//         authorizationRules: [{
//             action: "read",
//             subject: 'Wallet',
//             mainRule: true,
//         }]
//     },
//     register: {
//         method: 'post',
//         path: '/tenant/:tenantId/wallet/',
//         authorizationRules: [{
//             action: "create",
//             subject: "Wallet",
//             mainRule: true,
//         }]
//     }
// };

export const paymentMethod: TEndpoint = {
    listOther: {
        method: 'get',
        path: '/tenant/:tenantId/:otherId/payment-method/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'PaymentMethod',
            mainRule: true,
        }]
    },
    list: {
        method: 'get',
        path: '/tenant/:tenantId/payment-method/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'PaymentMethod',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/payment-method/:paymentMethodId',
        authorizationRules: [{
            action: "read",
            subject: 'PaymentMethod',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/tenant/:tenantId/payment-method/:paymentMethodId',
        authorizationRules: [{
            action: 'delete',
            subject: 'PaymentMethod',
            mainRule: true,
        }]
    },
    update: {
        method: 'put',
        path: '/tenant/:tenantId/payment-method/:paymentMethodId',
        schema: Joi.object({
            disabled: Joi.boolean()
        }),
        authorizationRules: [{
            action: "update",
            subject: "PaymentMethod",
            fields: ["disabled"],
            mainRule: true,
        }]
    },
    register: {
        method: 'post',
        path: '/tenant/:tenantId/payment-method/',
        schema: Joi.object({
            paymentMethodTypeCodename: Joi.string().trim().valid("MM", "CrC", "CC").required()
                .messages({
                    "any.only": "The allowed values for {#label} are \"MM\": Mobile Money, \"CrC\": Credit Card, \"CC\": Crypto Currency"
                }),
        }).when('paymentMethodTypeCodename', {
            is: Joi.string().valid('CC'),
            then: Joi.object({ address: Joi.string().required() })
        }).when('paymentMethodTypeCodename', {
            is: Joi.string().valid('MM'),
            then: Joi.object({
                customerPhoneNumber: Joi.string().trim().lowercase().required(),
            })
        }).when('paymentMethodTypeCodename', {
            is: Joi.string().valid('CrC'),
            then: Joi.object({
                customerName: Joi.string().trim().lowercase().required(),
                customerSurname: Joi.string().trim().lowercase().required(),
                customerEmail: Joi.string().trim().lowercase().email().required(),
                customerPhoneNumber: Joi.string().trim().lowercase().required(),
                customerAddress: Joi.string().trim().lowercase().required(),
                customerCity: Joi.string().trim().lowercase().required(),
                customerCountry: Joi.string().trim().lowercase().required(),
                customerState: Joi.string().trim().lowercase().required(),
                customerZipCode: Joi.string().trim().lowercase().required(),
            })
        }),
        authorizationRules: [{
            action: "create",
            subject: "PaymentMethod",
            fields: [
                "paymentMethodTypeCodename",
                'address',
                'customerName', 'customerSurname', 'customerEmail', 'customerPhoneNumber',
                'customerAddress', 'customerCity', 'customerState', 'customerCountry', 'customerZipCode'
            ],
            mainRule: true,
        }]
    }
};

export const investment: TEndpoint = {
    listByProject: {
        method: 'get',
        path: '/tenant/:tenantId/project/:projectId/investment/list/:selfOrOther/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Investment',
            mainRule: true,
        }]
    },
    list: {
        method: 'get',
        path: '/tenant/:tenantId/investment/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Investment',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/investment/:investmentId',
        authorizationRules: [{
            action: "read",
            subject: 'Investment',
            mainRule: true,
        }]
    },
    invest: {
        method: 'post',
        path: '/tenant/:tenantId/investment/',
        schema: Joi.object({
            amount: Joi.number().required(),
            projectId: Joi.number().integer().required(),
            term: Joi.number().integer().required()
        }),
        authorizationRules: [{
            action: 'create',
            subject: 'Investment',
            fields: ["amount", "projectId", "term"],
            mainRule: true
        }]
    }
};

export const transaction: TEndpoint = {
    listOther: {
        method: 'get',
        path: '/tenant/:tenantId/:otherId/transaction/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Transaction',
            mainRule: true,
        }]
    },
    list: {
        method: 'get',
        path: '/tenant/:tenantId/transaction/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Transaction',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/transaction/:transactionId',
        authorizationRules: [{
            action: "read",
            subject: 'Transaction',
            mainRule: true,
        }]
    },
    makeDeposit: {
        method: 'post',
        path: '/tenant/:tenantId/transaction',
        schema: Joi.object({
            investmentResume: Joi.string().trim().required(),
            paymentMethodTypeCodename: Joi.string().trim().valid("MM", "CrC", "CC").required()
                .messages({
                    "any.only": "The allowed values for {#label} are \"MM\": Mobile Money, \"CrC\": Credit Card, \"CC\": Crypto Currency"
                }),
            // amount: Joi.number().required(),
            currency: Joi.string().trim().lowercase().valid("usd", "usdc").required()
                .messages({ "any.only": "The accepted currency are \"USD\", \"USDC\"" }),
            transactionId: Joi.string().uuid().required(),
        }).when('paymentMethodTypeCodename', {
            is: Joi.string().valid('CC'),
            then: Joi.object({ address: Joi.string().required() })
        }).when('paymentMethodTypeCodename', {
            is: Joi.string().valid('CrC'),
            then: Joi.object({
                customerName: Joi.string().trim().lowercase().required(),
                customerSurname: Joi.string().trim().lowercase().required(),
                customerEmail: Joi.string().trim().lowercase().email().required(),
                customerPhoneNumber: Joi.string().trim().lowercase().required(),
                customerAddress: Joi.string().trim().lowercase().required(),
                customerCity: Joi.string().trim().lowercase().required(),
                customerCountry: Joi.string().trim().lowercase().required(),
                customerState: Joi.string().trim().lowercase().required(),
                customerZipCode: Joi.string().trim().lowercase().required(),
            })
        }),
        authorizationRules: [{
            action: 'create',
            subject: 'Transaction',
            fields: [
                'amount', 'currency', 'sender', 'recipient', 'reason', 'transactionId', 'paymentMethodType',
                'address',
                'customerName', 'customerSurname', 'customerEmail', 'customerPhoneNumber',
                'customerAddress', 'customerCity', 'customerState', 'customerCountry', 'customerZipCode'
            ],
            mainRule: true,
        }]
    },
    syncCinetpayPayment: {
        method: 'post',
        path: '/transaction/cinetpay/synchronize-payment',
    }
}

export const invitation: TEndpoint = {
    list: {
        method: 'get',
        path: '/tenant/:tenantId/invitation/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'Invitation',
            mainRule: true,
        }]
    },
    remove: {
        method: 'delete',
        path: '/tenant/:tenantId/invitation/:invitationId',
        authorizationRules: [{
            action: 'delete',
            subject: 'Invitation',
            mainRule: true,
        }]
    },
    confirm: {
        method: 'post',
        path: '/tenant/:tenantId/invitation/reply',
        schema: Joi.object({
            confirmation: Joi.boolean().required(),
            invitationId: Joi.number().integer().required(),
        }),
        authorizationRules: [{
            action: 'update',
            subject: 'Invitation',
            fields: ['confirm'],
            mainRule: true
        }]
    },
    invite: {
        method: 'post',
        path: '/tenant/:tenantId/invitation',
        schema: Joi.object({
            emails: Joi.array().items(
                {
                    email: Joi.string().lowercase().trim().email().required(),
                    roleId: Joi.number().integer().required(),
                }
            ).required(),
        }),
        authorizationRules: [{
            action: 'create',
            subject: 'Invitation',
            mainRule: true
        }]
    }
};

export const chat: TEndpoint = {
    listRoom: {
        method: 'get',
        path: '/chat/room/list',
        authorizationRules: [{
            action: 'read',
            subject: 'Room',
            mainRule: true
        }]
    },
    retriveRoom: {
        method: 'get',
        path: '/chat/room/:roomId',
        authorizationRules: [{
            action: 'read',
            subject: 'Room',
            mainRule: true
        }]
    },
    history: { // message history
        method: 'get',
        path: '/chat/room/:roomId/list/message/:page?/:perPage?',
        authorizationRules: [{
            action: 'read',
            subject: 'Message',
            mainRule: true
        }]
    },
    remove: { // remove message
        method: 'delete',
        path: '/chat/message/:messageId',
        authorizationRules: [{
            action: 'delete',
            subject: 'Message',
            mainRule: true
        }]
    },
    post: { // post message
        method: 'post',
        path: '/chat',
        schema: Joi.object({
            roomId: Joi.number().integer().required(),
            message: Joi.string().required(),
            replyTo: Joi.number().integer()
        }),
        authorizationRules: [{
            action: 'create',
            subject: 'Message',
            mainRule: true
        }]
    }
}

export const investmentTerm: TEndpoint = {
    list: {
        method: 'get',
        path: '/tenant/:tenantId/investment-term/list/:page?/:perPage?',
        authorizationRules: [{
            action: "read",
            subject: 'InvestmentTerm',
            mainRule: true,
        }]
    },
    retrive: {
        method: 'get',
        path: '/tenant/:tenantId/investment-term/:investmentTermId',
        authorizationRules: [{
            action: "read",
            subject: 'InvestmentTerm',
            mainRule: true,
        }]
    },
    update: {
        method: 'put',
        path: '/tenant/:tenantId/investment-term/:investmentTermId',
        schema: Joi.object({
            name: Joi.string().lowercase().trim().alphanum().min(3).max(30),
            description: Joi.string().lowercase().trim(),
            disabled: Joi.boolean(),
        }),
        authorizationRules: [{
            action: "update",
            subject: "InvestmentTerm",
            fields: ["name", "description", "disabled"],
            mainRule: true
        }]
    },
    register: {
        method: 'post',
        path: '/tenant/:tenantId/investment-term',
        schema: Joi.object({
            term: Joi.number().required(),
            benefit: Joi.number().required(),
            name: Joi.string().lowercase().trim().alphanum().min(3).max(30).required(),
            description: Joi.string().lowercase().trim(),
        }),
        authorizationRules: [{
            action: "create",
            subject: "InvestmentTerm",
            fields: ["name", "description", "term", "benefit"],
            mainRule: true
        }]
    }
};
