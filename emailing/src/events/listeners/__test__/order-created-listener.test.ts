import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedEvent, OrderStatus, Subjects } from "@rvticketing/common";
import mongoose, { mongo } from 'mongoose'
import { User } from "../../../models/user";
import { Email } from "../../../models/email";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const user = new User({
        email: "test@test.com",
        id: mongoose.Types.ObjectId().toHexString(),
    })

    await user.save()

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        userId: user.id,
        expiresAt: "",
        status: OrderStatus.Created,
        version: 0,
        ticket: {
            id: "",
            price: 100
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, user }
}

it('saves the email data on receiving a valid event', async () => {
    const { listener, data, msg, user } = await setup();

    await listener.onMessage(data, msg);

    const email = await Email.findOne({
        address: user.email,
        data: data
    })

    expect(email!.address).toEqual(user.email)
    expect(email!.data).toEqual(data)
    expect(email!.event).toEqual(Subjects.OrderCreated)

})


it('acks the msg', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})