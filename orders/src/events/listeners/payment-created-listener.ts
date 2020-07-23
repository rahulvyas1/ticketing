import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket';
import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from '@rvticketing/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';



export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{

    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { id, orderId } = data;
        console.log("orderId",orderId)
        const allOrders  = await Order.find({});
        console.log('all orders',allOrders)
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error("Order not found.")
        }
        order.set({ status: OrderStatus.Complete })
        await order.save()
        msg.ack()
    }

}
