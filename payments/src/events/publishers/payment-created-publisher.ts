import { PaymentCreatedEvent, Publisher, Subjects } from "@hrrtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects = Subjects.PaymentCreated;

  onPublish(): void {
    console.log(`Published to ${Subjects.PaymentCreated}`);
  }
}
