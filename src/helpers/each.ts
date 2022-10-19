function each(col: any, callback: Function) {
    let key: keyof typeof col;
    for (key in col)
        col[key] = callback(col[key], key, col);

    return col;
}

export default each;