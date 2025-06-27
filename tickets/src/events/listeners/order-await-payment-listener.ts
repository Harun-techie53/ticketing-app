import { Listener, OrderAwaitPaymentEvent, Subjects } from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderAwaitPaymentListener extends Listener<OrderAwaitPaymentEvent> {
  subject: Subjects = Subjects.OrderAwaitPayment;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: OrderAwaitPaymentEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      order: {
        id: data.id,
        user: data.userId,
      },
    });

    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });

    msg.ack();
  }
}
