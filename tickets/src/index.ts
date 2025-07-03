import mongoose from "mongoose";
import { app } from "./app";
import { natsClient } from "./nats-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { AuctionExpiredListener } from "./events/listeners/auction-expired-listener";
import { OrderAwaitPaymentListener } from "./events/listeners/order-await-payment-listener";
import { OrderCompletedListener } from "./events/listeners/order-completed-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT not defined yet");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI not defined yet");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS Cluster ID not defined yet");
  }

  if (!process.env.NATS_CLIENT_URL) {
    throw new Error("NATS Client URL not defined yet");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS Client ID not defined yet");
  }

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_CLIENT_URL
    );
    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
    new AuctionExpiredListener(natsClient.client).listen();
    new OrderAwaitPaymentListener(natsClient.client).listen();
    new OrderCompletedListener(natsClient.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Database error", error);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!");
  });
};

start();
