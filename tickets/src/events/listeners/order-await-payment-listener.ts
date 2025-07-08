import { Listener, OrderAwaitPaymentEvent, Subjects } from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { User } from "../../models/user";

export class OrderAwaitPaymentListener extends Listener<OrderAwaitPaymentEvent> {
  subject: Subjects = Subjects.OrderAwaitPayment;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: OrderAwaitPaymentEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticketId);
    const user = await User.findById(data.userId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    ticket.set({
      order: {
        id: data.id,
        user,
      },
    });

    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      resaledPrice: ticket.resaledPrice!,
    });

    msg.ack();
  }
}
