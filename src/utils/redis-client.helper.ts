import Redis from 'ioredis';
import { redis as redisConfig } from '../configs/utils.conf';
import debug from 'debug';

const redisConnect = new Redis({
    ...redisConfig,
    db: 0
});
const logger = debug("coollionfi:redisClient");

redisConnect.on('connect', () => {
    logger('Connected to Redis');
});

redisConnect.on('error', (err) => {
    logger("%O", "Error connecting to Redis", err);
});

export const redisClient = redisConnect;
