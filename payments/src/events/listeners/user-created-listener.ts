import { Listener, Subjects, UserCreatedEvent } from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { User } from "../../models/user";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects = Subjects.UserCreated;
  queueGroup: string = "payment-service";

  async onMessage(data: UserCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, firstName, lastName, email, role } = data;

    const user = User.build({
      id,
      firstName,
      lastName,
      email,
      role,
    });

    await user.save();

    msg.ack();
  }
}
