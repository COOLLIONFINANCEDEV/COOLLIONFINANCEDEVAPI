const validator = require('validator')

class Serializer {
    static normalize(obj, ignore) {
        if (Object.keys(obj).length == 0)
            throw new Error("Give empty object!");

        for (const key in obj) {
            if (!ignore.includes(key)) {
                const value = obj[key];

                obj[key] = validator.escape(validator.trim(value));
            }
        }

        return obj;
    }
}

module.exports = Serializer;