import {
  BadRequestError,
  OrderStatus,
  restrictRoute,
  UserRoles,
  validateRequest,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { natsClient } from "../nats-client";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  verifyToken,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId))
      .withMessage("Ticket Id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Find the ticket user is trying to order
    const ticket = await Ticket.findById(req.body.ticketId);

    if (!ticket) {
      return next(new BadRequestError("Ticket not found", 404));
    }

    // Make sure the ticket is not reserved already by user
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      return next(new BadRequestError("Ticket is already reserved", 400));
    }

    // Calculate an expiration date for the order
    const expiresAt = new Date();

    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to database

    const order = Order.build({
      user: req.currentUser?.id as string,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });

    await order.save();

    res.status(201).send({ data: order });

    // Publish an event that an order was created
    new OrderCreatedPublisher(natsClient.client).publish({
      id: order.id,
      user: order.user,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
    });
  }
);

export { router as createRouter };
