import { Message } from 'node-nats-streaming'
import { Listener, TicketUpdatedEvent, Subjects } from '@rvticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price, id, version } = data;
console.log("id, version",id, version)
        const ticket = await Ticket.findByEvent({ id, version })

        if (!ticket) {
            throw new Error("Ticket not found")
        }
        console.log('Ticket found!!!')

        ticket.set({ title, price });
        await ticket.save();

        console.log('TICKET SAVED!!!!')
        msg.ack();
    }
}