import { Response, Request, NextFunction } from "express";
import { UAParser } from "ua-parser-js";
import { ICustomRequest } from "../types/app.type";

export const getClientInfo = (req: ICustomRequest, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const parser = new UAParser();
    parser.setUA(String(userAgent));

    const clientInfo = {
        ip: ip,
        device: parser.getDevice(),
        browser: parser.getBrowser(),
        os: parser.getOS(),
        engine: parser.getEngine(),
        cpu: parser.getCPU(),
    };

    req.clientInfo = clientInfo;
    next();
};

