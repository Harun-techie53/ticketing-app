import {
  BadRequestError,
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  TicketStatus,
} from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
  queueGroup = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      order: {
        id: data.id,
        user: data.user,
      },
      status: TicketStatus.Reserved,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      resaledPrice: ticket.resaledPrice!,
      maxResalePrice: ticket.maxResalePrice,
    });

    msg.ack();
  }
}
