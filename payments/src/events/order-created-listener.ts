import { Listener, OrderCreatedEvent, Subjects } from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroup = "payments-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, user, status, ticket, version } = data;

    const order = Order.build({
      id,
      user,
      status,
      price: ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
