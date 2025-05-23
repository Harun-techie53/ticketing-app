import { Publisher, OrderCreatedEvent, Subjects } from "@hrrtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  onPublish(): void {
    console.log("Published order created event");
  }
}
