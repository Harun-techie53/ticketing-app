import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { TicketStatus, verifyToken } from "@hrrtickets/common";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find().populate("order.user");
    res.status(200).send({ data: tickets });
  }
);

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id).populate("order.user");
    res.status(200).send({ data: ticket });
  }
);

router.get(
  "/api/tickets/reserved/me",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tickets = await Ticket.find({
      "order.user": req.currentUser?.id,
      status: TicketStatus.Reserved,
    }).populate("order.user");

    res.status(200).json({
      data: tickets,
    });
  }
);

router.get(
  "/api/tickets/users/:userId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tickets = await Ticket.find({ user: req.params.userId });

    res.status(200).send({ data: tickets });
  }
);

export { router as getRouter };
