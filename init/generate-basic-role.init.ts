// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/generate-basic-role.init.ts\"
/**
 * GENERATE BASIC ROLE
 */


import { Prisma, PrismaClient, Role } from "@prisma/client";
import chalk from "chalk";
import { ICASL, TAccountTypesCodename } from "../src/types/app.type";
import { getSubjectFields, processLog } from "./helpers.init";



export const roles: {
    name: string,
    public: boolean,
    accountType: TAccountTypesCodename,
    subjects: "*" | Prisma.ModelName[],
    exclude?: {
        actions: ICASL.Action[],
        subject?: Prisma.ModelName,
        fields?: string[],
    }[],
    nonSelfRessourcePerms?: {
        actions: ICASL.Action[],
        subject: Prisma.ModelName,
        excludeFields?: string[],
    }[],
    specificPermissions?: string[],
}[] = [
        {
            name: 'superuser',
            public: false,
            accountType: "ADMIN",
            subjects: "*",
        },
        {
            name: 'user',
            public: false,
            accountType: "ZERO",
            subjects: ["Tenant", "AccountType", "User", "Invitation", "Message", "Room"],
            exclude: [
                { actions: ["read", "delete"], fields: ["deleted", "updatedAt"] },
                { actions: ["update", "delete", "create"], subject: "Room" },
                { actions: ["update"], subject: "Message" },
                { actions: ["read"], subject: "AccountType", fields: ["restricted", "updatedAt"] },
                { actions: ["create", "update", "delete"], subject: "AccountType" },
                { actions: ["delete", "read"], subject: "User", fields: ["password"] },
                { actions: ["read", "update", "delete"], subject: "User", fields: ["accountActivated", "deleted", "updatedAt"] },
                { actions: ["create"], subject: "User" },
                { actions: ["update", "delete", "read"], subject: "Tenant" },
            ],
            specificPermissions: [
                "create__Tenant__withAccountTypeLENDER",
                "create__Tenant__withAccountTypeBORROWER"
            ]
        },
        {
            name: 'lender',
            public: false,
            accountType: "LENDER",
            subjects: ["Tenant", "AccountType", "UserTenant", "Role", "Wallet",
                "PaymentMethod", "Investment", "Transaction", "Invitation"],
            exclude: [
                { actions: ["read"], subject: "AccountType", fields: ["restricted", "updatedAt"] },
                { actions: ["create", "update", "delete"], subject: "AccountType" },
                { actions: ["read", "delete"], fields: ["deleted", "updatedAt"] },
                { actions: ["update"], subject: "UserTenant" },
                { actions: ["update", "delete"], subject: "Wallet" },
                { actions: ["update"], subject: "PaymentMethod" },
                { actions: ["update", "delete"], subject: "Investment" },
                { actions: ["update", "delete"], subject: "Transaction" },
            ],
            nonSelfRessourcePerms: [
                { actions: ["read"], subject: "User", excludeFields: ["emailVerified", "phoneVerified", "phone2Verified", "accountActivated", "deleted", "updatedAt"] },
                { actions: ["read"], subject: "Role", excludeFields: ["updatedAt"] },
                { actions: ["read"], subject: "Project", excludeFields: ["deleted", "treat", "disabled", "updatedAt"] },
            ],
            specificPermissions: [
                "create__Tenant__withAccountTypeLENDER_COMMUNITY"
            ]
        },
        {
            name: "borrower",
            public: false,
            accountType: "BORROWER",
            subjects: ["Tenant", "Project", "Role", "Invitation", "UserTenant"],
            exclude: [
                { actions: ["read", "delete"], fields: ["deleted", "updatedAt"] },
                { actions: ["update"], subject: "UserTenant" },
            ],
            nonSelfRessourcePerms: [
                { actions: ["read"], subject: "User", excludeFields: ["emailVerified", "phoneVerified", "phone2Verified", "accountActivated", "deleted", "updatedAt"] },
                { actions: ["read"], subject: "Role", excludeFields: ["updatedAt"] },
                { actions: ["read"], subject: "Project", excludeFields: ["deleted", "treat", "disabled", "updatedAt"] },
                { actions: ["read"], subject: "Investment", excludeFields: ["term", "dueAmount", "dueGain", "collectionDate", "gainCollected", "updatedAt"] },
            ]
        },
        {
            name: 'community',
            public: false,
            accountType: "LENDER_COMMUNITY",
            subjects: ["Tenant", "UserTenant", "Role", "Invitation"],
            exclude: [
                { actions: ["read", "delete"], fields: ["deleted", "updatedAt"] },
                { actions: ["update"], subject: "UserTenant" },
            ],
            nonSelfRessourcePerms: [
                { actions: ["read"], subject: "User", excludeFields: ["emailVerified", "phoneVerified", "phone2Verified", "accountActivated", "deleted", "updatedAt"] },
                { actions: ["read"], subject: "Role", excludeFields: ["updatedAt"] },
                { actions: ["read"], subject: "Tenant", excludeFields: ["accountTypeId", "deleted", "updatedAt"] },
            ]
        },
        {
            name: "community member",
            public: true,
            accountType: "LENDER_COMMUNITY",
            subjects: ["UserTenant", "Tenant", "Transaction", "PaymentMethod", "Investment"],
            exclude: [
                { actions: ["read", "delete"], fields: ["deleted", "updatedAt"] },
                { actions: ["create", "delete", "update"], subject: "UserTenant" },
                { actions: ["delete", "update", "create"], subject: "Tenant" },
                { actions: ["delete", "update", "create"], subject: "Transaction" },
                { actions: ["delete", "update", "create"], subject: "PaymentMethod" },
                { actions: ["delete", "update", "create"], subject: "Investment" },
            ],
            nonSelfRessourcePerms: [
                { actions: ["read"], subject: "User", excludeFields: ["emailVerified", "phoneVerified", "phone2Verified", "accountActivated", "deleted", "updatedAt"] },
                { actions: ["read"], subject: "Role", excludeFields: ["updatedAt"] },
                { actions: ["read"], subject: "Project", excludeFields: ["deleted", "treat", "disabled", "updatedAt"] },
                { actions: ["read"], subject: "Tenant", excludeFields: ["accountTypeId", "deleted", "updatedAt"] },
                {
                    actions: ["read"], subject: "Transaction", excludeFields: [
                        "updatedAt",
                        "operator",
                        "customerName",
                        "customerSurname",
                        "customerEmail",
                        "customerPhoneNumber",
                        "customerAddress",
                        "customerCity",
                        "customerCountry",
                        "customerState",
                        "customerZipCode",
                        "address",
                    ]
                },
            ]
        }
    ];

const prismaClient = new PrismaClient();


export const buildRoles = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        processLog(chalk`{bold \n\t\t\t*** BUILD BASIC ROLE ***}`);
        processLog();

        // processLog(chalk`{bold Formatting role schema... }`);
        for (const roleSchema of roles) {
            processLog(chalk`{bold Setting ${roleSchema.name} role... }`);
            let role: Role | null = null;

            try {
                role = await prismaClient.role.findFirst({ where: { name: roleSchema.name } });

                if (!role) {
                    role = await prismaClient.role.create({
                        data: {
                            name: roleSchema.name,
                            published: roleSchema.public,
                        },
                    });
                }

                processLog(chalk`{bold.green OK}`);
                processLog("", 1);
            }
            catch (err) {
                processLog(chalk`{bold.red error: }`);
                console.log(err);
                processLog("", 2);
            }
            processLog(chalk`{bold \tApplying permissions... }`);

            if (role) {

                let allowedPermissions: number[] = [];
                let restrictedPermissions: number[] = [];
                const { subjects, exclude, nonSelfRessourcePerms, specificPermissions } = roleSchema;
                const availablePermissions = await prismaClient.permission.findMany();

                // Building allowed permission
                if (subjects === "*")
                    allowedPermissions = availablePermissions.map(({ id }) => id);
                else {
                    const subjectPerms = availablePermissions.filter(({ codename }) => {
                        const permSubject = codename.split("__")[1] as Prisma.ModelName;
                        return subjects.includes(permSubject);
                    });
                    allowedPermissions = subjectPerms.map(({ id }) => id);
                }

                // Building restricted permissions
                if (exclude) {
                    const excludedPerms: Set<string> = new Set();

                    for (const { actions, subject, fields } of exclude) {
                        for (const action of actions) {
                            let perm = `${action}__`;

                            if (subject) {
                                perm += `${subject}__`;

                                if (fields) fields.forEach(field => {
                                    excludedPerms.add(`${perm}${field}`);
                                });
                            } else {
                                for (const subject of subjects) {
                                    perm += `${subject}__`;

                                    if (fields) fields.forEach(field => {
                                        excludedPerms.add(`${perm}${field}`);
                                    });
                                }
                            }
                        }
                    };

                    const subjectPerms = availablePermissions.filter(({ codename }) => {
                        const name2 = codename.split("__");
                        delete name2[2];
                        return [...excludedPerms].toString().includes(codename) || [...excludedPerms].toString().includes(name2.join("__"));
                    });
                    restrictedPermissions = subjectPerms.map(({ id }) => id);
                }

                // Adding allowed permissions for non self ressources to allowed permissions
                if (nonSelfRessourcePerms) {
                    const perms = new Set<string>();

                    for (const { actions, subject, excludeFields } of nonSelfRessourcePerms) {
                        const fields = getSubjectFields(subject).filter(field => !excludeFields?.includes(field));

                        for (const action of actions) {
                            let perm = `${action}__${subject}__`;

                            fields.forEach(field => {
                                perms.add(`${perm}${field}Other`);
                            });
                        }
                    };

                    const subjectPerms = availablePermissions.filter(({ codename }) => {
                        return [...perms].includes(codename);
                    });
                    allowedPermissions.push(...subjectPerms.map(({ id }) => id));
                }

                // Adding specific permissions  to allowed permissions
                if (specificPermissions)
                    for (const permission of specificPermissions) {
                        const perm = availablePermissions.find(p => p.codename === permission);

                        if (perm) allowedPermissions.push(perm.id);
                    }

                allowedPermissions = allowedPermissions.filter(permId => !restrictedPermissions.includes(permId));
                const permRole = allowedPermissions.map(permissionId => ({ roleId: Number(role?.id), permissionId }));

                try {
                    await prismaClient.permissionRole.createMany({ data: permRole, skipDuplicates: true });
                    processLog(chalk`{bold.green OK}`);
                    processLog("", 1);
                } catch (err) {
                    processLog(chalk`{bold.red FAILED}`, 2);
                    processLog(chalk`{bold.red error: }`);
                    console.log(err);
                    processLog("", 2);
                }

            } else {
                processLog(chalk`{bold.red FAILED}`);
                processLog("", 1);
                reject("FAILED")
            }
        }
        processLog("", 1);
        processLog(chalk`{blue.bold Role generation... }`);
        processLog(chalk`{green.bold OK}`, 2);
        resolve();
    });
};


