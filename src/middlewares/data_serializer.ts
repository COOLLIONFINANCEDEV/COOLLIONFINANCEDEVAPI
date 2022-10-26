import serializerInterface from 'src/types/serializer_interface';
import validator from 'validator';

import init_object_key from 'src/helpers/init_object_key';
import each from 'src/helpers/each';
import notNullType from 'src/types/not_null_type';


export default function serializer(body: { [x: string]: any; } | any, fieldConstraints: { [x: string]: string; }, options?: serializerInterface) {
    let result: { [x: string]: any; } = {};
    let bool = false;

    const bodyFields = Object.keys(body);
    const fieldConstraintsFields = Object.keys(fieldConstraints);
    const diffFields = bodyFields.filter((key) => !fieldConstraintsFields.includes(key));

    if (!options?.acceptUnknow)
        diffFields.forEach(field => {
            init_object_key(result, field);
            result[field].push("This field it's a parasite!");
        });



    for (const field in fieldConstraints) {
        const constraints = each(fieldConstraints[field].split(','), (item: string) => item.trim());
        let constraint: string | string[];

        // console.log(constraints, constraints.includes("optional"), not_null(body[field]), body[field]);
        // console.log(field, not_null(body[field]));

        // if (body[field] == undefined && !constraints.includes("optional")) {
        if (constraints.includes("optional") && !not_null(body[field], ["empty"])) {
            // init_object_key(result, field);
            // result[field].push("This field is required!");
            // console.log('jumps', field);
        }
        else {
            for (constraint of constraints) {
                if (typeof constraint == 'string')
                    constraint = constraint.split('=')

                switch (constraint[0]) {
                    case 'not_null':
                        bool = not_null(body[field]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push("This field is required!");
                        }
                        // false = 0 | true = 1
                        break;
                    case 'min_length':
                        bool = min_length(body[field], constraint[1]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Min length is ${constraint[1]}!`);
                        }
                        break;
                    case 'max_length':
                        bool = max_length(body[field], constraint[1]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Max length is ${constraint[1]}!`);
                        }
                        break;
                    case 'email':
                        bool = is_email(body[field]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be a valid email!`);
                        }
                        break;
                    case 'number':
                        bool = is_numeric(body[field]);


                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be a number!`);
                        }
                        break;
                    case 'integer':
                        bool = is_integer(body[field]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be an integer!`);
                        } else
                            body[field] = validator.toInt(String(body[field]));
                        break;
                    case 'float':
                        bool = is_float(body[field]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be a float!`);
                        } else
                            body[field] = validator.toFloat(String(body[field]));
                        break;
                    case 'boolean':
                        bool = is_boolean(body[field], { loose: options?.booleanUseStrict || false });

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be a boolean!`);

                        } else
                            body[field] = validator.toBoolean(String(body[field]));
                        break;
                    case 'date':
                        bool = is_date(body[field]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Must be a date!`);

                        } else
                            body[field] = validator.toDate(String(body[field]));
                        break;
                    case 'like':
                        bool = is_like(body[field], constraint[1]);

                        if (!bool) {
                            init_object_key(result, field);
                            result[field].push(`Valid value is: ${constraint[1].substring(1, constraint[1].length - 1).replaceAll('|', ',')} !`);
                        } else
                            body[field] = body[field].toString().trim();
                    case 'optional': break;
                    default:
                        throw new Error(`[SERIALIZER][ERROR]: ${constraint[0]} is not a supported constraint!`);
                }
            }
        }
    }

    if (Object.keys(result).length == 0)
        return { error: false, result: body };

    return { error: true, result: result };
}





function not_null(str: string | number | null | undefined, ignore?: notNullType) {
    let bool = false;

    if (typeof str === "string" || typeof str == "number" || typeof str == "boolean") {
        bool = is_boolean(str);
    }

    if (bool) return true;

    if ((str == '' || str == ' ') && !ignore?.includes("empty")) return false;

    if ((str == null || str == undefined) && !ignore?.includes("null")) return false;

    return true;
}


function min_length(str: string | any[], length: string | number) {
    length = Number(length);

    if (!Number.isInteger(length))
        throw new Error("[SERIALIZER][ERROR]: length property of min_length must be an integer!");
    
    if (str == undefined) return false;

    return str.length >= length;
}


function max_length(str: string | any[], length: string | number) {
    length = Number(length);

    if (!Number.isInteger(length))
        throw new Error("[SERIALIZER][ERROR]: length property of max_length must be an integer!");

    if (str == undefined) return false;
    
    return str.length <= length
}


function is_email(str: string | number) {
    return not_null(str) ? validator.isEmail(String(str)) : false;
}


function is_numeric(str: string) {
    return not_null(str) ? validator.isNumeric(str) : false;
}


function is_integer(str: string | number) {
    return validator.isInt(String(str));
}


function is_float(str: string | number) {
    return not_null(str) ? validator.isFloat(String(str)) : false;
}


function is_boolean(str: string | number, option?: { loose: boolean }) {
    try {
        return validator.isBoolean(String(str), option);
    }
    catch (e) {
        return false;
    }
}


function is_date(str: any): boolean {
    return validator.isDate(String(str));
}

function is_like(str: string | number, likeOption: string, strict?: boolean): boolean {
    const likeOptionLastIndex = likeOption.length - 1;

    if (likeOption[0] !== "[" || likeOption[likeOptionLastIndex] !== "]")
        throw new Error("[SERIALIZER][ERROR]: Syntaxe error, valid syntaxe for like constraint is: like=[opt1 | opt2 | ... | optN]");

    const option = likeOption.substring(1, likeOptionLastIndex).split("|");

    const bool: Array<boolean> = [];

    option.forEach((liked) => {
        if (strict) bool.push(str == liked.trim());
        else bool.push(str.toString().trim() == liked.trim());
    });

    for (const valid of bool)
        if (valid) return true;

    return false;
}



