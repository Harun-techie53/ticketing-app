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
import { User } from "../../models/user";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
  queueGroup = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    const user = await User.findById(data.user);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    ticket.set({
      order: {
        id: data.id,
        user: data.user,
      },
      status: TicketStatus.Reserved,
    });

    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
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
