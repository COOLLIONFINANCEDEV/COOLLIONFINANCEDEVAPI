// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/generate-permission.init.ts\"
/**
 * GENERATE PERMISSIONS
 *
 * @format action__Subject__field
 */

import { Permission, Prisma, PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { getSubjectFields, processLog, progressBar } from "./helpers.init";

const buildPermissionName = (action: string, subject: string, field: string) => {
    let name = "";

    switch (action) {
        case 'create':
            name = "Set";
            break;
        case 'read':
            name = "view";
            break;
        case 'update':
            name = "Modify";
            break;
        case 'delete':
            name = "Delete";
            break;
        case 'create':
            name = "manage";
            break;
        default:
            name = action;
    }

    return `${name} ${field} of ${subject}`;
}



export const generatePermissions = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        processLog(chalk`{bold \n\t\t\t*** BUILD PERMISSIONS ***}`);

        const actions = ["create", "read", "update", "delete", "manage"];

        processLog();
        processLog(chalk`{bold Getting prisma model name... }`);

        const subjects = Object.keys(Prisma.ModelName);

        processLog(chalk`{bold.green OK}`, 1);

        // ## BUILDING PERMISSIONS
        const permissions = new Set<Partial<Permission>>();
        let progressLabel = "Building permissions";
        let lastLogLength = progressBar(0, 0, progressLabel);

        for (const index in subjects) {
            const subject = subjects[index];
            const fields = getSubjectFields(subject);

            for (const field of fields) {
                for (const action of actions) {
                    const permission = `${action}__${subject}__${field}`;
                    const permissionForOther = `${action}__${subject}__${field}Other`;
                    permissions.add({
                        name: buildPermissionName(action, subject, field),
                        codename: permission,
                    });
                    permissions.add({
                        name: buildPermissionName(action, subject, `${field}Other`),
                        codename: permissionForOther,
                    });
                }
            }

            // log progress
            const progress = (Number(index) + 1) / subjects.length;
            lastLogLength = progressBar(progress, lastLogLength, progressLabel);
        }
        processLog("", 1);

        processLog(chalk`{bold Adding specific permissions... }`);
        permissions.add({ name: "create a lender account", codename: "create__Tenant__withAccountTypeLENDER" });
        permissions.add({ name: "create a borrower account", codename: "create__Tenant__withAccountTypeBORROWER" });
        permissions.add({ name: "create an admin account", codename: "create__Tenant__withAccountTypeADMIN" });
        permissions.add({ name: "create a account of community of lender", codename: "create__Tenant__withAccountTypeLENDER_COMMUNITY" });
        processLog(chalk`{bold.green OK}`, 2);

        const prismaClient = new PrismaClient();

        processLog(chalk`{blue.bold Registering permissions... }`);
        prismaClient.permission.createMany({
            data: [...(permissions as Set<Required<Permission>>)],
            skipDuplicates: true
        }).then((result) => resolve(processLog(chalk`{green.bold OK}`, 2)))
            .catch((err) => {
                processLog(chalk`{red.bold FAILED}`, 2);
                console.log(err);
                processLog("", 2);
                reject(err);
            });
    });
}

