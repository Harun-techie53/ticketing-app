import { AuctionCreatedEvent, Publisher, Subjects } from "@hrrtickets/common";

export class AuctionCreatedPublisher extends Publisher<AuctionCreatedEvent> {
  subject: Subjects = Subjects.AuctionCreated;

  onPublish(): void {
    console.log(`Publish to ${Subjects.AuctionCreated}`);
  }
}
