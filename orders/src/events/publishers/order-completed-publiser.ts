import { OrderCompletedEvent, Publisher, Subjects } from "@hrrtickets/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  subject: Subjects = Subjects.OrderCompleted;

  onPublish(): void {
    console.log(`Published to ${Subjects.OrderCompleted}`);
  }
}
