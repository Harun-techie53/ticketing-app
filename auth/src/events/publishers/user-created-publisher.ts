import { Publisher, Subjects, UserCreatedEvent } from "@hrrtickets/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects = Subjects.UserCreated;

  onPublish(): void {
    console.log(`Publish to ${Subjects.UserCreated}`);
  }
}
