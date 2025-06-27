import {
  Listener,
  OrderAwaitPaymentEvent,
  OrderStatus,
  Subjects,
} from "@hrrtickets/common";
import { Message } from "node-nats-streaming";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { PaymentCreatedPublisher } from "../publishers/payment-created-publisher";
import { Order } from "../../models/order";

export class OrderAwaitPaymentListener extends Listener<OrderAwaitPaymentEvent> {
  subject: Subjects = Subjects.OrderAwaitPayment;
  queueGroup: string = "payment-service";

  async onMessage(
    data: OrderAwaitPaymentEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      user: data.userId,
      status: OrderStatus.AwaitingPayment,
      price: data.price,
    });

    await order.save();
    
    await stripe.charges.create({
      currency: "usd",
      amount: data.price * 100,
      source: "tok_visa",
    });

    const payment = Payment.build({
      user: data.userId,
      orderId: data.id,
      price: data.price,
    });

    await payment.save();

    new PaymentCreatedPublisher(this.client).publish({
      order: {
        id: payment.orderId,
        status: OrderStatus.Complete,
      },
    });

    msg.ack();
  }
}
