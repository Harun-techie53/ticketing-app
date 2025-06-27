import {
  Listener,
  OrderCompletedEvent,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  subject: Subjects = Subjects.OrderCompleted;
  queueGroup: string = "payment-service";

  async onMessage(
    data: OrderCompletedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: data.status,
    });

    await order.save();

    msg.ack();
  }
}
