import { OrderCancelledEvent, Subjects, Publisher } from "@rvticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject= Subjects.OrderCancelled;
}