import { Queue } from "bullmq";
import { ordersExpiration, OrdersExpirationQueuePayload } from "./queue-types";
import { redisConnection } from "./redis-config";

const queue = new Queue<OrdersExpirationQueuePayload>(ordersExpiration, {
  connection: redisConnection,
});

export { queue };
