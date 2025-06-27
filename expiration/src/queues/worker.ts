import { Job, Worker } from "bullmq";
import {
  auctionsExpiration,
  AuctionsExpirationQueuePayload,
  ordersExpiration,
  OrdersExpirationQueuePayload,
} from "./queue-types";
import { redisConnection } from "./redis-config";
import { OrderExpiredPublisher } from "../events/publishers/order-expired-publisher";
import { natsClient } from "../nats-client";
import { AuctionExpiredPublisher } from "../events/publishers/auction-expired-publisher";

async function processOrderExpirationJob(job: Job) {
  const { orderId } = job.data;
  console.log(`Processing job for order with ID: ${orderId}`);
}

const ordersExpirationWorker = new Worker<OrdersExpirationQueuePayload>(
  ordersExpiration,
  async (job: Job) => {
    const { orderId } = job.data;

    await new OrderExpiredPublisher(natsClient.client).publish({ orderId });
  },
  {
    connection: redisConnection,
  }
);

const auctionsExpirationWorker = new Worker<AuctionsExpirationQueuePayload>(
  auctionsExpiration,
  async (job: Job) => {
    const { auctionId } = job.data;

    await new AuctionExpiredPublisher(natsClient.client).publish({
      id: auctionId,
    });
  },
  {
    connection: redisConnection,
  }
);

export { ordersExpirationWorker, auctionsExpirationWorker };
