import { Listener, Subjects, TicketCreatedEvent } from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroup = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, version, maxResalePrice } = data;

    console.log("TicketCreatedListener data", data);

    const ticket = Ticket.build({
      id,
      title,
      price,
      maxResalePrice,
    });

    await ticket.save();

    msg.ack();
  }
}
