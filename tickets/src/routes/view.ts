import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { APIFeatures, TicketStatus, verifyToken } from "@hrrtickets/common";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    const featureQuery = new APIFeatures(
      Ticket.find().populate("order.user"),
      req.query
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const tickets = await featureQuery.getQuery();
    const totalDocumentsCount = await featureQuery.getTotalCount();

    res.status(200).send({
      data: {
        tickets: tickets,
        totalDocumentsCount,
      },
    });
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

router.get(
  "/api/tickets/liked/me",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const likedTickets = await Ticket.find({
      likedBy: req.currentUser?.id!,
    });

    const totalDocumentsCount = await Ticket.find({
      likedBy: req.currentUser?.id!,
    }).countDocuments();

    res.status(200).json({
      data: {
        tickets: likedTickets,
        totalDocumentsCount,
      },
    });
  }
);

export { router as getRouter };
