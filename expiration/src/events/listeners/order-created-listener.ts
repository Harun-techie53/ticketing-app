import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { queue } from "../../queues/queue";
import { ordersExpiration } from "../../queues/queue-types";
import { worker } from "../../queues/worker";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    queue.add(
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
