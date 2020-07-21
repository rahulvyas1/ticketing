import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "@rvticketing/common";
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    //Create instance of the listener class
    const listener = new OrderCancelledListener(natsWrapper.client);


    const orderId = mongoose.Types.ObjectId().toHexString(),
    // create and save ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'sabjk3'
    })

    ticket.set({ orderId })

    await ticket.save()

    //Create a fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }

}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup()
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})