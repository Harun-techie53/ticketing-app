import { AuctionExpiredEvent, Publisher, Subjects } from "@hrrtickets/common";

export class AuctionExpiredPublisher extends Publisher<AuctionExpiredEvent> {
  subject: Subjects = Subjects.AuctionExpired;

  onPublish(): void {
    console.log(`Published to ${Subjects.AuctionExpired}`);
  }
}
