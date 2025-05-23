import {
  restrictRoute,
  UserRoles,
  validateRequest,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { TicketDto } from "../types/requestDto";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.post(
  "/api/tickets",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  [
    body("title")
      .trim()
      .isLength({ min: 3, max: 120 })
      .withMessage("Title must be between 3 to 120 characters"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be more than 10 characters"),
    body("price").isNumeric().withMessage("Price must be numeric"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, status, price } = req.body as TicketDto;

    const newTicket = Ticket.build({
      title,
      description,
      status,
      price,
      user: req.currentUser?.id as string,
    });

    await newTicket.save();

    new TicketCreatedPublisher(natsClient.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      version: newTicket.version,
    });

    res.status(201).send({ data: newTicket });
  }
);

export { router as createRouter };
