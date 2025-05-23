import { Job, Worker } from "bullmq";
import { ordersExpiration, OrdersExpirationQueuePayload } from "./queue-types";
import { redisConnection } from "./redis-config";
import { OrderExpiredPublisher } from "../events/publishers/order-expired-publisher";
import { natsClient } from "../nats-client";

async function processOrderExpirationJob(job: Job) {
  const { orderId } = job.data;
  console.log(`Processing job for order with ID: ${orderId}`);
}

const worker = new Worker<OrdersExpirationQueuePayload>(
  ordersExpiration,
  async (job: Job) => {
    const { orderId } = job.data;

    await new OrderExpiredPublisher(natsClient.client).publish({ orderId });
  },
  {
    connection: redisConnection,
  }
);

export { worker };
