function init_object_key(array: { [x: string]: any; }, key: keyof typeof array, defaultValue: any = []) {
    if (array[key] == undefined)
        array[key] = defaultValue;

    return array;
}

export default init_object_key;

