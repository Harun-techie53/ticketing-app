import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { ordersExpirationQueue } from "../../queues/queue";
import { ordersExpiration } from "../../queues/queue-types";
import { orderExpirationQueueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroup: string = orderExpirationQueueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    ordersExpirationQueue.add(
      ordersExpiration,
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
