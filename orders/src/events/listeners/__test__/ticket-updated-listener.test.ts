import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from "@rvticketing/common"
import mongoose from 'mongoose'
import { Ticket } from "../../../models/ticket"
import { Message } from 'node-nats-streaming'
const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const id =new mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
        id,
        title: ' concert',
        price: 20,
    })
    await ticket.save()

    console.log('ticket.id', ticket.id)
    console.log(' ticket.version ', ticket.version)
    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id,
        version: ticket.version + 1,
        title: ' concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }


    // Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all this
    return { msg, data, listener, ticket };
}

it('finds, updates and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})


it('acks the message', async () => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})


it('does not call if the event has a skipped version number', async () => {
    const { msg, data, ticket, listener } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (e) { }

    expect(msg.ack).not.toHaveBeenCalled();

})