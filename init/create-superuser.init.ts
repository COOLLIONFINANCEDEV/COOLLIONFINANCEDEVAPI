// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/create-superuser.init.ts\"
/**
 * GENERATE
 */

import readline from "readline";
import chalk from 'chalk';
import { exit } from "process";
import Joi from "@hapi/joi";
import { isPhoneNumber } from '../src/utils/validators.helper';
import { Prisma, PrismaClient } from "@prisma/client";
import Hasher from "../src/utils/hasher.helper";
import { hasher as hasherConfig } from "../src/configs/utils.conf";
import { app as appConfig } from "../src/configs/app.conf";
import { processLog } from "./helpers.init";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    {
        name: "email",
        question: "email: ",
    },
    {
        name: "phone",
        question: "phone (optional): ",
        optional: true,
    },
    {
        name: "password",
        question: "password: ",
        hideInput: true,
    }
]

const [email, phone, password] = questions;
const answers: Record<string, string> = {};

processLog(chalk`{bold \n\t\t\t*** CREATE SUPER USER ***}`);
processLog();

rl.question(email.question, (answer) => {
    if (!answer) {
        console.log(chalk`{bold.red Email address required!}`);
        rl.close();
        exit();
    }
    let schema = Joi.string().lowercase().trim().email().required();
    const result = schema.validate(answer);

    if (result.error) {
        console.log(chalk`{bold.red ${result.error.message}}`);
        rl.close();
        exit();
    }

    answers["email"] = answer;

    rl.question(phone.question, (answer) => {
        if (answer) {
            schema = Joi.string().lowercase().trim()
                .regex(/(^\+[1-9][0-9]{0,2}[ ]?[0-9]{8,12}$)|(^\+[1-9]{1,2}-[0-9]{3}[ ]?[0-9]{8,12}$)/)
                .messages({ "string.pattern.base": "Invalid phone number!" });
            // .custom(isPhoneNumber, "Validate phone number");
            const result = schema.validate(answer);

            if (result.error) {
                console.log(chalk`{bold.red ${result.error.message}}`);
                rl.close();
                exit();
            }
        }
        answers["phone"] = answer;

        rl.question(password.question, async (answer) => {
            if (!answer) {
                console.log(chalk`{bold.red Password required!}`);
                rl.close();
                exit();
            }
            schema = Joi.string().required()
                .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/)
                .messages({ "string.pattern.base": "Give a strong password for more security." });
            const result = schema.validate(answer);

            if (result.error) {
                console.log(chalk`{bold.red ${result.error.message}}`);
                rl.close();
                exit();
            }

            answers["password"] = answer;
            rl.close();

            console.log(chalk`{bold ...}`);

            const prismaClient = new PrismaClient();

            const hasher = new Hasher(hasherConfig.hashSecretKey);
            const passwordHash = await hasher.hashPasswordBcrypt(answers.password);
            answers["password"] = passwordHash;
            const baseUserRole = await prismaClient.role.findFirst({ where: { name: appConfig.baseUserRoleName } });

            if (baseUserRole === null) {
                console.log(chalk`{bold.red Base user role not found!}`);
                exit();
            }

            const permissionsRole = await prismaClient.permissionRole.findMany({ where: { roleId: baseUserRole.id } });

            if (permissionsRole.length === 0) {
                console.log(chalk`{bold.red Base user role have no permissions!}`);
                exit();
            }

            const perm = await prismaClient.permission.findFirst({ where: { codename: "create__Tenant__withAccountTypeADMIN" } })


            if (!perm) {
                console.log(chalk`{bold.red Create admin permissions not found!}`);
                exit();
            }

            const user = await prismaClient.user.create({ data: { accountActivated: true, email: "", password: "", ...answers } })
                .catch((err) => {
                    processLog("", 1);
                    processLog(chalk`{bold.red error: }`);
                    console.log(err);
                    processLog("", 2);
                    exit();
                });

            await prismaClient.usersPermissions.create({ data: { permissionId: perm.id, userId: user.id } });

            for (const { permissionId } of permissionsRole)
                await prismaClient.usersPermissions.create({ data: { permissionId: permissionId, userId: user.id } });

            processLog();
            processLog(chalk`{green.bold Superuser created successfully}`, 2);
        });
    });
});


