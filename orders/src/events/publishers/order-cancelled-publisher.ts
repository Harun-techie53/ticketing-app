import { OrderCancelledEvent, Publisher, Subjects } from "@hrrtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  onPublish(): void {
    console.log("Published order cancelled event");
  }
}
