import {
  BadRequestError,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroup: string = "payments-service";

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, version } = data;
    const order = await Order.findByEvent({ id, version });

    if (!order) {
      throw new BadRequestError("Order not found", 404);
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();
    msg.ack();
  }
}
