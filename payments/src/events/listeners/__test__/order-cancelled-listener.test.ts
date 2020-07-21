import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledEvent, OrderStatus } from "@rvticketing/common"
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)


    const orderId = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        status: OrderStatus.Created,
        price: 10,
        userId: '3j5',
        version: 0
    })

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id:orderId,
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order }
}

it('updates the status of the order', async () => {
    const { listener, data, msg,order } = await setup();
    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

})
it('acks the msg', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled();

})
