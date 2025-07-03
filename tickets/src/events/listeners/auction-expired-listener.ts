import { AuctionExpiredEvent, Listener, Subjects } from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Auction, AuctionStatusType } from "../../models/auction";
import { AuctionEndedPublisher } from "../publishers/auction-ended-publisher";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class AuctionExpiredListener extends Listener<AuctionExpiredEvent> {
  subject: Subjects = Subjects.AuctionExpired;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: AuctionExpiredEvent["data"],
    msg: Message
  ): Promise<void> {
    const auction = await Auction.findById(data.id).populate("ticket");

    if (!auction) {
      throw new Error("Auction not found");
    }

    auction.set({
      status: AuctionStatusType.Inactive,
    });

    await auction.save();

    if (!!auction.highestBidder) {
      auction.ticket.set({
        resaledPrice: auction.highestBidder.price,
        maxResalePrice: parseInt(auction.highestBidder.price.toString()) + 10,
      });

      await auction.ticket.save();

      new TicketUpdatedPublisher(this.client).publish({
        id: auction.ticket.id,
        title: auction.ticket.title,
        price: auction.ticket.price,
        version: auction.ticket.version,
        maxResalePrice: auction.ticket.maxResalePrice,
        resaledPrice: auction.ticket.resaledPrice!,
      });

      new AuctionEndedPublisher(this.client).publish({
        ticket: {
          id: auction.ticket.id,
          orderId: auction.ticket.order.id,
          resaledPrice: auction.ticket.resaledPrice,
        },
        highestBidder: {
          userId: auction.highestBidder.userId,
          price: auction.highestBidder.price,
        },
      });
    }

    msg.ack();
  }
}
