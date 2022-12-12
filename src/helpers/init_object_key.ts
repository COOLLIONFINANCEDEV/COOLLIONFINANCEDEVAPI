function init_object_key({ obj, key, defaultValue = {} }: { obj: { [x: string]: any; }; key: keyof typeof obj; defaultValue?: any; }) {
    if (obj[key] == undefined)
        obj[key] = defaultValue;

    return obj;
}

export default init_object_key;

