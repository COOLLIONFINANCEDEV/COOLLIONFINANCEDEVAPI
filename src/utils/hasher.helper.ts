import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { TCryptoOptions } from '../types/utils.type';
import { hasher as hasherConfig } from '../configs/utils.conf';

class Hasher {
    private options: TCryptoOptions;
    private secretKey: string;

    constructor(secretKey: string, options?: TCryptoOptions) {
        this.secretKey = secretKey;
        this.options = { ...hasherConfig.defaultOptions, ...options };
    }

    generateSalt(): Buffer {
        return crypto.randomBytes(this.options.saltLength!);
    }

    private hashString(value: string, salt: Buffer): Buffer {
        return crypto.pbkdf2Sync(
            value,
            salt,
            this.options.pbkdf2Iterations!,
            this.options.hashLength!,
            this.options.hashAlgorithm!
        );
    }

    private compareHashes(hash1: Buffer, hash2: Buffer): boolean {
        return crypto.timingSafeEqual(hash1, hash2);
    }

    private hmac(value: string, key: string): string {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(value);
        return hmac.digest('hex');
    }

    public hashPassword(password: string): string {
        const salt = this.generateSalt();
        const hash = this.hashString(password, salt);
        const combined = Buffer.concat([salt, hash]);
        return combined.toString('hex');
    }

    public verifyPassword(password: string, hash: string): boolean {
        const combined = Buffer.from(hash, 'hex');
        const salt = combined.slice(0, this.options.saltLength);
        const expectedHash = combined.slice(
            this.options.saltLength,
            this.options.saltLength! + this.options.hashLength!
        );
        const actualHash = this.hashString(password, salt);
        return this.compareHashes(actualHash, expectedHash);
    }

    public hashToken(token: string): string {
        return this.hmac(token, this.secretKey);
    }

    public hashPasswordBcrypt(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    public verifyPasswordBcrypt(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

export default Hasher;
