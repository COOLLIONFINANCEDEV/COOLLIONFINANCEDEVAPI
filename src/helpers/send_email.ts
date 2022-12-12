import sgMail from '@sendgrid/mail';
import { twilioConfig } from 'src/config';
import { FlowInstance } from 'twilio/lib/rest/studio/v1/flow';
sgMail.setApiKey(twilioConfig.SG_APIKEY);

// const msg = {
//     personalizations: [
//         {
//             to: [
//                 {
//                     email: "TO-EMAIL@to-email.com",
//                     name: "Lender username"
//                 }
//             ],
//             dynamic_template_data: {
//                 subject: "INVESTMENT ACCEPTED",
//                 transaction_issue: "rejected",
//                 // body: "Someone just added a new post!",
//                 username: "username",
//                 offer: "offername"
//             }
//         }
//     ],
//     from: {
//         email: "dev@coollionfi.com",
//         name: "COOL LION FINANCE BUSINESS"
//     },
//     // reply_to: {
//     //     email: "YOUREMAIL@YOUREMAIL.com",
//     //     name: "test"
//     // },
//     template_id: "d-83839b67e6d340da92ae57b79beee9bd"


// }


async function sg_send_email(
    {
        to,
        from = { name: "COOL LION FINANCE", email: "dev@coollionfi.com" },
        templateId = "d-83839b67e6d340da92ae57b79beee9bd",
        templateData
    }: {
        to: string;
        from?: { name?: string; email: string; };
        templateId?: string;
        templateData: { subject: string; title: string; username: string; body: string; } | { [x: string]: any };
    }
) {
    const data = {
        to: to,
        from: from,
        dynamicTemplateData: templateData,
        templateId: templateId,
    }
    try {
        return await sgMail.send(data);
    } catch (error) {
        throw error;
    }
}

export default sg_send_email;

// console.log(sg_send_email({
//     to: "dev@coollionfi.com",
//     templateData: {
//         subject: "test async",
//         title: "TEST",
//         username: "Doe",
//         body: "testing"
//     }
// }));

