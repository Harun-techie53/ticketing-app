import {
  AuctionEndedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderAwaitPaymentPublisher } from "../publishers/order-await-payment-publisher";

export class AuctionEndedListener extends Listener<AuctionEndedEvent> {
  subject: Subjects = Subjects.AuctionEnded;
  queueGroup: string = queueGroupName;

  async onMessage(
    data: AuctionEndedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.ticket.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      resaled: true,
      resaledAt: new Date(),
    });

    await order.save();

    const newOrder = Order.build({
      user: data.highestBidder.userId,
      status: OrderStatus.AwaitingPayment,
      ticket: order.ticket,
    });

    await newOrder.save();

    new OrderAwaitPaymentPublisher(this.client).publish({
      id: newOrder.id,
      userId: newOrder.user,
      price: data.highestBidder.price,
      ticketId: newOrder.ticket.id
    });

    msg.ack();
  }
}
