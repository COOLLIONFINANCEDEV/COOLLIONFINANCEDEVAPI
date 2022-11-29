// function init_array_key(array: [[key: any]], key: keyof typeof array, defaultValue: any = []) {
function init_array_key(array: any[], defaultValue: any = -1) {
    if (array == undefined) {
        array = []
        array.push(defaultValue);
    }

    return array;
}

export default init_array_key;

