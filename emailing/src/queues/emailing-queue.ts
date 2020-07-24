import Queue from 'bull';
import { Subjects } from '@rvticketing/common';
import { EmailStatus, EmailTemplates } from '../models/email';

interface Payload {
    address: string,
    event: Subjects,
    data: object,
    status: EmailStatus,
    template: EmailTemplates
}

const emailingQueue = new Queue<Payload>('email:sending', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

emailingQueue.process(async (job) => {
    console.log(
        'I want to send an email to ',
        job.data.address
    )

    // Send an email through here
})

export { emailingQueue }