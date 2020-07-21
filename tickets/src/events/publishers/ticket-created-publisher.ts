import { Publisher, Subjects, TicketCreatedEvent } from '@rvticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}