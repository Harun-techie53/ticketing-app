import { Publisher, Subjects, TicketCreatedEvent } from "@hrrtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  onPublish(): void {
    console.log("Ticket created event published");
  }
}
