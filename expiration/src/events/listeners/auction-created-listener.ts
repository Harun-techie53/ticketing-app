import { AuctionCreatedEvent, Listener, Subjects } from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { auctionsExpirationQueue } from "../../queues/queue";
import { auctionExpirationQueueGroupName } from "./queue-group-name";
import { auctionsExpiration } from "../../queues/queue-types";

export class AuctionCreatedListener extends Listener<AuctionCreatedEvent> {
  subject: Subjects = Subjects.AuctionCreated;
  queueGroup: string = auctionExpirationQueueGroupName;

  async onMessage(
    data: AuctionCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    auctionsExpirationQueue.add(
      auctionsExpiration,
      {
        auctionId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
