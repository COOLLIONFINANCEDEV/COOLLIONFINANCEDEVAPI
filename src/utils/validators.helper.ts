import Joi from "@hapi/joi";

export const isPhoneNumber = (value: string, helpers: Joi.CustomHelpers) => {
    if (!(/(^\+[1-9][0-9]{0,2}[ ]?[0-9]{8,12}$)|(^\+[1-9]{1,2}-[0-9]{3}[ ]?[0-9]{8,12}$)/.test(value))) {
        return helpers.error("string");
    }
    return value;
};