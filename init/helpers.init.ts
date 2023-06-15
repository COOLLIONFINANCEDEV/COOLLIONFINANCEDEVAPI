import { Prisma } from '@prisma/client';
import chalk from 'chalk';
// import logSymbols from 'log-symbols';

export const processLog = (message: any = "\n", line: number = 0) => {
    message = `${message}${"\n".repeat(line)}`;
    process.stdout.write(message);
}


export const progressBar = (progress: number, lastLogLength: number, label: string = "Progress") => { // Définition d'une fonction qui prend en paramètre la progression du script
    if (progress > 1) progress = 1;

    const filled = Math.floor(progress * 20); // Calcul du nombre de caractères à remplir dans la barre de progression
    const empty = 20 - filled; // Calcul du nombre de caractères vides dans la barre de progression
    const progressStr = `${'#'.repeat(filled)}${'.'.repeat(empty)}`; // Création de la chaîne de caractères représentant la barre de progression

    const progressText = chalk`{bold ${label}:} ${progressStr} {green.bold ${Math.floor(progress * 100)}%}`; // Création du texte à afficher dans la console, avec la barre de progression, le pourcentage de progression, et des couleurs
    // const statusIcon = progress === 1 ? logSymbols.success : logSymbols.info; // Définition du symbole à afficher en fonction de l'état de progression

    // Effacer la dernière ligne de la console avant d'écrire la nouvelle
    process.stdout.write('\r' + ' '.repeat(lastLogLength) + '\r');

    lastLogLength = progressText.length;
    process.stdout.write(progressText);

    return lastLogLength;
};


export const getSubjectFields = (subject: string) => {
    const dmmf = Prisma.dmmf.datamodel.models.find(value => value.name === subject);

    if (!dmmf) return [];

    let fields: string[] = dmmf.fields.map((field: any) => { if (field.kind == "scalar") return field.name });
    fields = fields.filter((field: string) => field !== undefined);

    return fields
}
