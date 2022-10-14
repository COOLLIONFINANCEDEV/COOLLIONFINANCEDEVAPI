const crypto = require("crypto")

class Hasher {
    static generate_salt(rounds, slice = 0,) {
        if (rounds == null) rounds = 16;

        if (rounds > 16)
            throw new Error(`${rounds} is greater than 16, Must be less that 16`);

        if (typeof rounds !== 'number')
            throw new Error('rounds param must be a number');

        if (slice) {
            if (slice < 5)
                throw new Error('slice param must higher than 4!');

            return crypto.randomBytes(rounds).toString('hex').slice(0, slice);
        }

        return crypto.randomBytes(rounds).toString('hex');
    }

    static hash(strToHash, salt) {
        if (strToHash == null)
            throw new Error('strToHash can not be null!');

        salt = salt || Hasher.generate_salt();

        const hash = crypto.pbkdf2Sync(strToHash, salt, 1000, 64, `sha512`).toString(`hex`);

        return { salt: salt, hash: hash }
    }

    static validate_hash(strToValidate, validHash, salt) {
        if (strToValidate == null)
            throw new Error('strToValidate can not be null!');

        if (hash == null)
            throw new Error('hash can not be null!');

        const hash = crypto.pbkdf2Sync(strToValidate, salt, 1000, 64, `sha512`).toString(`hex`);

        return hash === validHash;
    };
}

module.exports = Hasher;