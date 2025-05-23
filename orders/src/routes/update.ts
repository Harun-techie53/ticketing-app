import { BadRequestError, OrderStatus, verifyToken } from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.patch(
  "/api/orders/cancel/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      return next(new BadRequestError("Order not found", 404));
    }

    if (order.user.toString() !== req.currentUser?.id.toString()) {
      return next(
        new BadRequestError("Order not belongs to the current user", 401)
      );
    }

    order.status = OrderStatus.Cancelled;

    await order.save();
    console.log("typeof order id", typeof order.id);
    res.status(200).send({ data: order });

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
);

export { router as updateRouter };
