import {
  Listener,
  OrderCompletedEvent,
  OrderStatus,
  Subjects,
  TicketStatus,
} from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  subject: Subjects = Subjects.OrderCompleted;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: OrderCompletedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findOne({ "order.id": data.id });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      status: TicketStatus.Sold,
    });

    await ticket.save();

    msg.ack();
  }
}
