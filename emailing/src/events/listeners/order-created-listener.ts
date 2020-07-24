import { Listener, OrderCreatedEvent, Subjects } from '@rvticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Email, EmailTemplates, EmailStatus } from '../../models/email';
import { User } from '../../models/user';
import { emailingQueue } from '../../queues/emailing-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const user = await User.findById(data.userId);
        if (!user) {
            throw new Error('User not found!')
        }

        const email = Email.build({
            address: user.email,
            event: Subjects.OrderCreated,
            data: data,
            status: EmailStatus.Pending,
            template: EmailTemplates.OrderCreated
        })

        await email.save()

        await emailingQueue.add(email)

        msg.ack()

    }

}