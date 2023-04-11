export const outItemFromList = <T extends string | number | Record<string, any>>(input: T[], filterCallBack?: (input: T[]) => T[]) => {
    return new Promise<T[]>((resolve, reject) => {
        if (input.length === 0) resolve([]);

        if (filterCallBack) resolve(filterCallBack(input));

        if (typeof input[0] === "string" || typeof input[0] === "number")
            resolve(input.filter((item) => Boolean(item)));

        resolve(input.filter((item) => Object.keys(item).length > 0));
    });
};
