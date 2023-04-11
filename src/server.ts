import debug from 'debug';
import app from './app';
import io from './socket';

const logger = debug("coollion:server");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger(`Server running on port ${PORT}`);
});

const redisServer = io.attach(server);
if (redisServer) {
    logger("Connected to redis");
} else logger("Redis connection error");