
import { EmailAttrs, EmailStatus } from '../models/email';

export interface EmailerResponse {
    status: EmailStatus;
    id: string
}

export abstract class emailer {

    abstract sendOne(attrs: EmailAttrs): Promise<EmailerResponse>;

}


