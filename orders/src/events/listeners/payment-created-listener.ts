import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCompletedPublisher } from "../publishers/order-completed-publiser";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects = Subjects.PaymentCreated;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.order.id);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: data.order.status,
    });

    await order.save();

    await new OrderCompletedPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
    });
    msg.ack();
  }
}
