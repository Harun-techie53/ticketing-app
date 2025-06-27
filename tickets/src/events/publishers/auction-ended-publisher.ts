import { AuctionEndedEvent, Publisher, Subjects } from "@hrrtickets/common";

export class AuctionEndedPublisher extends Publisher<AuctionEndedEvent> {
  subject: Subjects = Subjects.AuctionEnded;

  onPublish(): void {
    console.log(`Publish to ${Subjects.AuctionEnded}`);
  }
}
