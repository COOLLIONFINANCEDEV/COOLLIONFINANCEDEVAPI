function init_array_key(array: [[key: any]], key: keyof typeof array, defaultValue: any = []) {
    if (array[key] == undefined)
        array[key] = defaultValue;

    return array;
}

export default init_array_key;

