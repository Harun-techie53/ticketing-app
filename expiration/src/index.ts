import { AuctionCreatedListener } from "./events/listeners/auction-created-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsClient } from "./nats-client";
import {
  auctionsExpirationWorker,
  ordersExpirationWorker,
} from "./queues/worker";

const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS Cluster ID not defined yet");
  }

  if (!process.env.NATS_CLIENT_URL) {
    throw new Error("NATS Client URL not defined yet");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS Client ID not defined yet");
  }

  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS HOST not defined yet");
  }

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_CLIENT_URL
    );
    console.log('Connected to NATS');
    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new OrderCreatedListener(natsClient.client).listen();
    new AuctionCreatedListener(natsClient.client).listen();

    ordersExpirationWorker.on("completed", (job) => {
      console.log(`Order Job completed for order ID: ${job.data.orderId}`);
    });

    ordersExpirationWorker.on("failed", (job, err) => {
      console.log(
        `Order Job failed for order ID: ${job?.data.orderId}, error: ${err}`
      );
    });

    auctionsExpirationWorker.on("completed", (job) => {
      console.log(`Order Job completed for order ID: ${job.data.auctionId}`);
    });

    auctionsExpirationWorker.on("failed", (job, err) => {
      console.log(
        `Order Job failed for order ID: ${job?.data.auctionId}, error: ${err}`
      );
    });
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());
  } catch (error) {
    console.log("Database error", error);
    process.exit(1);
  }
};

start();
