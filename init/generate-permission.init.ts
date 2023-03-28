// npx nodemon --watch ./init -e js,ts,json --exec \"ts-node init/generate-permission.init.ts\"




import chalk from 'chalk';
import logSymbols from 'log-symbols';

const processLog = (message: any = "\n", line: number = 0) => {
    message = `${message}${"\n".repeat(line)}`;
    process.stdout.write(message);
}


const progressBar = (progress: number, lastLogLength: number, label: string = "Progress") => { // Définition d'une fonction qui prend en paramètre la progression du script
    if (progress > 1) progress = 1;

    const filled = Math.floor(progress * 20); // Calcul du nombre de caractères à remplir dans la barre de progression
    const empty = 20 - filled; // Calcul du nombre de caractères vides dans la barre de progression
    const progressStr = `${'#'.repeat(filled)}${'.'.repeat(empty)}`; // Création de la chaîne de caractères représentant la barre de progression

    const progressText = chalk`{bold ${label}:} ${progressStr} {green.bold ${Math.floor(progress * 100)}%}`; // Création du texte à afficher dans la console, avec la barre de progression, le pourcentage de progression, et des couleurs
    const statusIcon = progress === 1 ? logSymbols.success : logSymbols.info; // Définition du symbole à afficher en fonction de l'état de progression

    // Effacer la dernière ligne de la console avant d'écrire la nouvelle
    process.stdout.write('\r' + ' '.repeat(lastLogLength) + '\r');

    lastLogLength = progressText.length;
    process.stdout.write(progressText);

    return lastLogLength;
};


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




// /**
//  * GENERATE PERMISSIONS
//  *
//  * @format action__Subject__field
//  */

import { Permission, Prisma, PrismaClient } from "@prisma/client";

processLog(chalk`{bold \t\t\t***BUILD PERMISSIONS ***}`);

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
    const dmmf = Prisma.dmmf.datamodel.models.find(value => value.name === subject);

    if (!dmmf) continue;

    let fields: string[] = dmmf.fields.map((field: any) => { if (field.kind == "scalar") return field.name });
    fields = fields.filter((field: string) => field !== undefined);

    for (const field of fields) {
        for (const action of actions) {
            const permission = `${action}__${subject}__${field}`;
            permissions.add({
                name: buildPermissionName(action, subject, field),
                codename: permission,
            });
        }
    }

    // log progress
    const progress = (Number(index) + 1) / subjects.length;
    lastLogLength = progressBar(progress, lastLogLength, progressLabel);
}
processLog("", 2);

const prismaClient = new PrismaClient();

processLog(chalk`{blue.bold Registering permissions... }`);
(async () => {
    prismaClient.permission.createMany({
        data: [...(permissions as Set<Required<Permission>>)],
        skipDuplicates: true
    }).then(() => processLog(chalk`{green.bold OK}`, 2))
        .catch((err) => {
            processLog(chalk`{red.bold FAILED}`, 2);
            console.log(err);
            processLog("", 2);
        });
})();


