
import mongoose from 'mongoose'
import { Subjects } from '@rvticketing/common';

export enum EmailTemplates {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:created'
}

export enum EmailStatus {
    Pending = "pending",
    Completed = "completed"
}

interface EmailAttrs {
    address: string;
    status: EmailStatus
    data: object;
    event: Subjects;
    template: EmailTemplates;
}

interface EmailDoc extends mongoose.Document {
    address: string;
    status: EmailStatus
    data: object;
    event: Subjects;
    template: EmailTemplates;
}

interface EmailModel extends mongoose.Model<EmailDoc> {
    build(attrs: EmailAttrs): EmailDoc;
}



const emailSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(EmailStatus)
    },
    data: {
        type: Object,
        required: false,
    },
    event: {
        type: String,
        required: true,
        enum: Object.values(Subjects)
    },
    template: {
        type: String,
        required: true,
        enum: Object.values(EmailTemplates)
    }

},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    })




emailSchema.statics.build = (attrs: EmailAttrs) => {
    return new Email({
        address: attrs.address,
        status: attrs.status,
        data: attrs.data,
        event: attrs.event,
        template: attrs.template
    })
}

const Email = mongoose.model<EmailDoc, EmailModel>('Email', emailSchema)

export { Email,EmailDoc,EmailAttrs };