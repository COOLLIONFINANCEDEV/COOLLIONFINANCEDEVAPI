// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/generate-basic-account-type.init.ts\"
/**
 * GENERATE BASIC ROLE
 */

import { AccountType, PrismaClient } from "@prisma/client";
import { TAccountTypesCodename } from "../src/types/app.type";
import { roles } from "./generate-basic-role.init";
import { processLog } from "./helpers.init";
import chalk from 'chalk';

const accountTypes: {
    name: string,
    codename: TAccountTypesCodename,
    description?: string,
    restricted: boolean
}[] = [
        {
            name: "administrator",
            codename: "ADMIN",
            description: "",
            restricted: true
        },
        {
            name: "borrower",
            codename: "BORROWER",
            description: "",
            restricted: false
        },
        {
            name: "lender",
            codename: "LENDER",
            description: "",
            restricted: false
        },
        {
            name: "community of lenders",
            codename: "LENDER_COMMUNITY",
            description: "",
            restricted: false
        },
    ];

export const generateAccountType = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        processLog(chalk`{bold \n\t\t\t*** BUILD BASIC ACCOUNT TYPE ***}`);
        processLog();

        const accountTypeRole: { accountTypeId: number, roleId: number }[] = [];

        const prismaClient = new PrismaClient();
        let at: AccountType | null = null;

        for (const accountType of accountTypes) {
            processLog(chalk`{bold Setting ${accountType.name} account type... }`);
            try {
                at = await prismaClient.accountType.findFirst({ where: { codename: accountType.codename } });

                if (!at)
                    at = await prismaClient.accountType.create({ data: accountType });
                
                processLog(chalk`{bold.green OK}`);
                processLog("", 1);
            } catch (err) {
                processLog(chalk`{bold.red error: }`);
                console.log(err);
                processLog("", 2);
            }

            processLog(chalk`{bold \tApplying role... }`);

            if (at) {
                const roleName = roles.find(({ accountType }) => accountType === at?.codename );
                try {

                    if (roleName) {
                        const role = await prismaClient.role.findFirst({ where: { name: roleName.name } });

                        if (role) {
                            const atRole = {
                                roleId: role.id,
                                accountTypeId: at.id
                            };

                            const newAtRole = await prismaClient.accountTypeRole.findFirst({ where: atRole });

                            if (!newAtRole)
                                await prismaClient.accountTypeRole.create({
                                    data: atRole
                                });
                            processLog(chalk`{bold.green OK}`);
                            processLog("", 1);
                        } else {
                            processLog(chalk`{bold.red FAILED 0}`);
                            processLog("", 1);
                        }
                    } else {
                        processLog(chalk`{bold.red FAILED 1}`);
                        processLog("", 1);
                    }
                } catch (err) {
                    processLog(chalk`{bold.red FAILED 2}`);
                    processLog("", 1);
                    processLog(chalk`{bold.red error: }`);
                    console.log(err);
                    processLog("", 2);
                }
            } else {
                processLog(chalk`{bold.red FAILED 3}`);
                processLog("", 1);
            }
        }
        processLog("", 1);
        processLog(chalk`{blue.bold Account type generation... }`);
        processLog(chalk`{green.bold OK}`, 2);
        resolve();
    });
};
