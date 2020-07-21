import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@rvticketing/common";
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
const setup = async () => {
    //Create instance of the listener class
    const listener = new OrderCreatedListener(natsWrapper.client);


    // create and save ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'sabjk3'
    })

    await ticket.save()

    //Create a fake data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        userId: '3nknkd',
        expiresAt: 'dmkdf',
        status: OrderStatus.Created,
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }

}

it('sets userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('calls the ack message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})