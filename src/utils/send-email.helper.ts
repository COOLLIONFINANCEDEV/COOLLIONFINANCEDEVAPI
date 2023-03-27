import sgMail from '@sendgrid/mail';
import { twilio as twilioConfig } from '../configs/utils.conf';
import { TSGMailData } from '../types/utils.type';

sgMail.setApiKey(twilioConfig.sendGridApiKey);

const sgSendEmail = async (...options: TSGMailData[]) => {
    try {
        const data = options.map((option) => { return { ...twilioConfig.defaultOptions, ...option } });
        return await sgMail.send(data);
    } catch (error) {
        throw error;
    }
}

export default sgSendEmail;
