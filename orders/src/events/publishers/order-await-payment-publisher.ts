import {
  OrderAwaitPaymentEvent,
  Publisher,
  Subjects,
} from "@hrrtickets/common";

export class OrderAwaitPaymentPublisher extends Publisher<OrderAwaitPaymentEvent> {
  subject: Subjects = Subjects.OrderAwaitPayment;

  onPublish(): void {
    console.log(`Publish to ${Subjects.OrderAwaitPayment}`);
  }
}
