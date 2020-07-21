import { Publisher, PaymentCreatedEvent, Subjects } from "@rvticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}