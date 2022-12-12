function init_object_key({ obj, key, defaultValue = {} }: { obj: { [x: string]: any; }; key: keyof typeof obj; defaultValue?: any; }) {
    console.log("obj :", obj);
    console.log("key: ", key);

    console.log("obj[key] :", obj[key]);


    if (obj[key] == undefined)
        obj[key] = defaultValue;

    console.log("obj update:", obj);
    console.log("obj[key] update:", obj[key]);
    return obj;
}

export default init_object_key;

