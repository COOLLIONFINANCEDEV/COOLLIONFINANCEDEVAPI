import jwt from "jsonwebtoken";
import { app as appConfig } from "../configs/app.conf";

const constants = appConfig.constants;

export const jwtErrorHandler = (err: any) => {
    if (err instanceof jwt.TokenExpiredError)
        return constants.TOKEN_EXPIRED;
    else if (err instanceof jwt.JsonWebTokenError)
        return constants.INVALID_TOKEN;
    else return false;
};

