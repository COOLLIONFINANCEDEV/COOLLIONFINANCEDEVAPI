import crypto from 'crypto';

class Hasher {
    static generate_salt(rounds?: number | null, slice: number = 0,): string {
        if (rounds == null || undefined) rounds = 16;

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

    static hash(strToHash: string, salt?: string | null | undefined): { salt: string, hash: string } {
        if (strToHash == null)
            throw new Error('strToHash can not be null!');

        salt = salt || Hasher.generate_salt();

        const hash = crypto.pbkdf2Sync(strToHash, salt, 1000, 64, `sha512`).toString(`hex`);

        return { salt: salt, hash: hash }
    }

    static validate_hash(strToValidate: string, validHash: string, salt: string) {
        if (strToValidate == null)
            throw new Error('strToValidate can not be null!');

        if (validHash == null)
            throw new Error('validHash can not be null!');

        const hash = crypto.pbkdf2Sync(strToValidate, salt, 1000, 64, `sha512`).toString(`hex`);

        return hash === validHash;
    };
}

export default Hasher;

