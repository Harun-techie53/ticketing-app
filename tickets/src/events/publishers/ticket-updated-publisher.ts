import { Publisher, Subjects, TicketUpdatedEvent } from "@hrrtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  onPublish(): void {
    console.log("Ticket updated event published");
  }
}
