function resolve_undefined(val: any | undefined): typeof val {
    console.log(val);

    return val != undefined ? val : val;
}

export default resolve_undefined;