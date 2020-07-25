const sgMail = require('@sendgrid/mail');
import { EmailAttrs, EmailStatus } from '../models/email';
import { emailer, EmailerResponse } from './email';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class sendgridMailer extends emailer {

    async sendOne(attrs: EmailAttrs):  Promise<EmailerResponse> {
        return { status: EmailStatus.Completed, id: ""}
    }
}