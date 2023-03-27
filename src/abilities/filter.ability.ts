import { Prisma } from "@prisma/client";
import { ICASL, ICustomRequest } from "../types/app.type";

type AbilitiesFilter<T extends Record<string, any>> = {
    subject: Prisma.ModelName;
    action?: ICASL.Action;
    abilities: Required<ICustomRequest>["abilities"];
    input: T[];
    selfInput?: boolean;
};


export const abilitiesFilter = <T extends Record<string, any>>(arg: AbilitiesFilter<T>, customFilter?: (arg: AbilitiesFilter<T>) => T[]) => {

    const { subject, action = "read", abilities, input, selfInput = true } = arg;

    return new Promise<T[]>((resolve, reject) => {
        if (input.length === 0) resolve([]);
        
        if (customFilter) {
            try {
                resolve(customFilter({ subject, action, abilities, input, selfInput }));
            } catch (err) {
                reject(err);
            }
        }

        const filteredInput = input.map((value) => {
            const filteredValue: Record<string, any> = {};

            Object.keys(value).forEach((item) => {
                if (abilities.can(action, subject, selfInput ? item : `${item}Other`))
                    filteredValue[item] = value[item];
            });

            return filteredValue as T;
        });
        resolve(filteredInput);
    });
};
