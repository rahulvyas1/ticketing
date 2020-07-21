import { Publisher, Subjects, TicketUpdatedEvent } from '@rvticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}