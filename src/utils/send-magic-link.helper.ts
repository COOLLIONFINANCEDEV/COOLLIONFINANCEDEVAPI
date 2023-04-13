import jwt from "jsonwebtoken";
import { app as appConfig } from "../configs/app.conf";
import { twilio as twilioConfig } from "../configs/utils.conf";
import sgSendEmail from "./send-email.helper";


export const sendMagicLink = async (userId: number, to: string) => {
    const token = jwt.sign({ userId: userId }, appConfig.jwtSecret, { expiresIn: appConfig.magicLinkExpirationTime });
    const tokenBase64Url = Buffer.from(token).toString("base64url");
    const magicLink = `${appConfig.appBaseUrl}?magicLink=${tokenBase64Url}`;

    await sgSendEmail({
        from: {
            email: appConfig.contacts.noReply,
            name: `${twilioConfig.defaultOptions.from.name} Account Team`
        },
        to,
        templateId: twilioConfig.templateIDs.accountActivation,
        dynamicTemplateData: {
            magicLink,
            appName: appConfig.appName,
            teamContact: appConfig.contacts.info
        }
    });
};
