import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@rvticketing/common';
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper';
const EXPIRATION_WINDOW_SECONDS = 0.5 * 60;

const router = express.Router();

router.post(
    "/api/orders",
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .withMessage('ticketId is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError()
        }

        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved.")
        }

        // Calculate an expiration date for this order
        const expiration = new Date();

        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)


        // Build the order and save it to the db
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save();

        console.log("created order: ",order)


        new OrderCreatedPublisher(natsWrapper.client).publish({
            version: order.version,
            id: order.id,
            userId: order.userId,
            status: order.status,
            ticket: {
                id: ticket.id,
                price: ticket.price
            },
            expiresAt: order.expiresAt.toISOString()
        })

        // Publish an event saying that an order was created
        res.status(201).send(order)
    })


export { router as newOrderRouter }