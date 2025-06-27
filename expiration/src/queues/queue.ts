import { Queue } from "bullmq";
import {
  auctionsExpiration,
  AuctionsExpirationQueuePayload,
  ordersExpiration,
  OrdersExpirationQueuePayload,
} from "./queue-types";
import { redisConnection } from "./redis-config";

const ordersExpirationQueue = new Queue<OrdersExpirationQueuePayload>(
  ordersExpiration,
  {
    connection: redisConnection,
  }
);

const auctionsExpirationQueue = new Queue<AuctionsExpirationQueuePayload>(
  auctionsExpiration,
  {
    connection: redisConnection,
  }
);

export { ordersExpirationQueue, auctionsExpirationQueue };
