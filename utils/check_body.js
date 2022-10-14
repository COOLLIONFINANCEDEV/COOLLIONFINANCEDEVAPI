const validator = require("validator");

exports.check_body = (body, fieldConstraints) => {
    const result = {}
    let bool = false;


    for (const field in fieldConstraints) {
        const constraints = fieldConstraints[field].split(',');

        for (let constraint of constraints) {
            constraint = (constraint.trim()).split('=')

            switch (constraint[0]) {
                case 'not_null':
                    bool = not_null(body[field]);

                    if (!bool) {
                        if (result[field] == undefined)
                            result[field] = []
                        result[field].push("This field is required!");
                    }
                    break;
                case 'min_length':
                    bool = min_length(body[field], constraint[1]);

                    if (!bool) {
                        if (result[field] == undefined)
                            result[field] = []
                        result[field].push(`Min length is ${constraint[1]}!`);
                    }
                    break;
                case 'max_length':
                    bool = max_length(body[field], constraint[1]);

                    if (!bool) {
                        if (result[field] == undefined)
                            result[field] = []
                        result[field].push(`Max length is ${constraint[1]}!`);
                    }
                    break;
                case 'is_email':
                    bool = is_email(body[field]);

                    if (!bool) {
                        if (result[field] == undefined)
                            result[field] = []
                        result[field].push(`Must be a valid email!`);
                    }
                    break;
                default:
                    throw new Error(`${constraint[0]} is not a constraint!`)
            }
        }

        // console.log(field, constraints);
    }

    return result;
}

function not_null(str) {
    return !(str == '' || str == ' ' || str == null || str == undefined);
}

function min_length(str, length) {
    length = Number(length);

    if (!Number.isInteger(length))
        throw new Error("length property of min_length must be an integer!");
    
    return str.length >= length;
}


function max_length(str, length) {
    length = Number(length);

    if (!Number.isInteger(length))
        throw new Error("length property of max_length must be an integer!");

    return str.length <= length
}


function is_email(str) {
    return validator.isEmail(str);
}