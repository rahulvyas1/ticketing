import { Publisher, ExpirationCompleteEvent, Subjects } from "@rvticketing/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}