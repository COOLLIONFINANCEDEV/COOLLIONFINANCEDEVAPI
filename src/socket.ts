import { Server, Socket } from "socket.io";
import { authenticate } from "./utils/auth.middleware";
import { ICustomRequest } from "./types/app.type";
const io = new Server();
import jwt from "jsonwebtoken";
import { app as appConfig } from "./configs/app.conf";
import { jwtErrorHandler } from "./utils/jwt-error.helper";
import debug from 'debug';
import { redisClient } from "./utils/redis-client.helper";

const constants = appConfig.constants;
const logger = debug("coollionfi:socket");

const socketAuthenticate = async (socket: Socket) => {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader) {
        socket.emit("auth", constants.AUTH_HEADER_MISSED);
        socket.disconnect();
        return;
    }

    const [bearer, token] = authHeader.split(" ");

    if (!bearer || !token || bearer !== 'Bearer') {
        socket.emit("auth", constants.ERR_BEARER_TOKEN);
        socket.disconnect();
        return;
    }

    try {
        const decodedToken = jwt.verify(token, appConfig.jwtSecret);

        if (typeof decodedToken === "string") {
            socket.emit("auth", constants.INVALID_TOKEN);
            socket.disconnect();
            return;
        }

        const session = await redisClient.get(decodedToken.sessionId);

        if (session === null) {
            socket.emit("auth", constants.EXP_SESSION);
            socket.disconnect();
            return;
        }

        const parsedSession = JSON.parse(session);
        const rooms: string[] = parsedSession[3];

        socket.join(rooms);
        socket.emit("auth", constants.LOGGED);
        socket.emit("rooms", "rooms joined");
    } catch (err) {
        logger(err);

        const jwtError = jwtErrorHandler(err);

        if (jwtError)
            socket.emit("auth", jwtError);
        else
            socket.emit("auth", constants.INVALID_TOKEN);

        socket.disconnect();
    }
}

io.on("connection", async (socket) => {
    await socketAuthenticate(socket);
});


export default io;