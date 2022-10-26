import crypto from 'crypto';
import Cryptr from 'cryptr';
import CryptoJS from 'crypto-js';

const cryptr = new Cryptr(String(process.env.CRYPTR_SECRET_KEY));

class Hasher {
    static generate_salt(rounds?: number | null, slice: number = 0,) {
        if (rounds == null || undefined) rounds = 16;

        // if (rounds > 16)
        //     throw new Error(`${rounds} is greater than 16, Must be less that 16`);

        if (typeof rounds !== 'number')
            throw new Error('rounds param must be a number');

        if (slice) {
            if (slice < 5)
                throw new Error('slice param must higher than 4!');

            return {
                buffer: crypto.randomBytes(rounds),
                hexString: crypto.randomBytes(rounds).toString('hex').slice(0, slice)
            }
        }

        return {
            buffer: crypto.randomBytes(rounds),
            hexString: crypto.randomBytes(rounds).toString('hex'),
        }
    }

    static hash(strToHash: string, salt?: string | null | undefined): { salt: string, hash: string } {
        if (strToHash == null)
            throw new Error('strToHash can not be null!');

        salt = salt || Hasher.generate_salt().hexString;

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
    }

    static crypt_builder(secretKey: string, secretIV: string, hashAlgorithm?: string) {
        hashAlgorithm = hashAlgorithm !== undefined ? hashAlgorithm : "sha256";
        return {
            secret: crypto.createHash(hashAlgorithm).update(secretKey, 'utf-8').digest('hex').substring(0, 32),
            iv: crypto.createHash(hashAlgorithm).update(secretIV, 'utf-8').digest('hex').substring(0, 16)
        }
    }

    static encrypt(text: string, secretKey: string, options?: { [x: string]: any }) {
        // const algorithm = options?.algorithm || "aes-256-cbc";
        // const secretIV = options?.secretIV || "";

        // const { secret, iv } = Hasher.crypt_builder(secretKey, secretIV);

        // const cypher = crypto.createCipheriv(algorithm, secret, iv);
        // let encryted = cypher.update(text, 'utf8', 'base64');
        // encryted += cypher.final('base64');

        // return Buffer.from(encryted).toString('base64');

        // return cryptr.encrypt(text);

        return CryptoJS.AES.encrypt(text, secretKey).toString();
    }

    static decrypt(crypted: string, secretKey: string, options?: { [x: string]: any }) {
        // const algorithm = options?.algorithm || "aes-256-cbc";
        // const secretIV = options?.secretIV || "MSa9Czv5RNdanUjXwVF3uFPiVz43RAebNHhvNuYR7E5GzNXH5x";

        // const { secret, iv } = Hasher.crypt_builder(secretKey, secretIV);

        // const buffer = Buffer.from(crypted, 'base64');
        // crypted = buffer.toString('utf-8');
        // const decypher = crypto.createDecipheriv(algorithm, secret, iv);
        // let decrypted = decypher.update(crypted, 'base64', 'utf8');
        // decrypted = decypher.final('utf8');

        // return decrypted;

        // return cryptr.decrypt(crypted);

        return CryptoJS.AES.decrypt(crypted, secretKey).toString(CryptoJS.enc.Utf8);
    }
}

export default Hasher;

