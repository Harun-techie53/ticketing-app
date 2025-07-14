import {
  BadRequestError,
  restrictRoute,
  TicketStatus,
  UserRoles,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { TicketUpdateDto } from "../types/requestDto";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new BadRequestError("Ticket not found", 404));
    }

    if (ticket.user.toString() !== req.currentUser?.id.toString()) {
      return next(
        new BadRequestError("Ticket not belongs to the current user", 401)
      );
    }

    if (
      !!ticket.order &&
      ticket.order !== null &&
      ticket.status !== TicketStatus.InStock
    ) {
      return next(
        new BadRequestError("Update Not Permissible: Ticket is Reserved", 403)
      );
    }

    ticket.set(req.body as TicketUpdateDto);

    const olderVersion = ticket.version;

    await ticket.save();

    const newVersion = ticket.version;

    if (olderVersion !== newVersion) {
      new TicketUpdatedPublisher(natsClient.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        version: ticket.version,
        maxResalePrice: ticket.maxResalePrice,
      });
    }

    res.status(200).send({
      data: ticket,
    });
  }
);

router.put(
  "/api/tickets/:id/like",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new BadRequestError("Ticket not found", 404));
    }

    if (ticket.likedBy.includes(req.currentUser?.id!)) {
      return next(
        new BadRequestError("Ticket is already liked by the user", 400)
      );
    }

    ticket.likedBy.push(req.currentUser?.id!);

    await ticket.save();

    res.status(200).json({
      data: ticket,
      status: "success",
    });
  }
);

router.put(
  "/api/tickets/:id/dislike",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new BadRequestError("Ticket not found", 404));
    }

    if (!ticket.likedBy.includes(req.currentUser?.id!)) {
      return next(new BadRequestError("Ticket is not liked yet", 400));
    }

    const likedByUsers = ticket.likedBy.filter(
      (userId) => userId.toString() !== req.currentUser?.id
    );

    ticket.set({
      likedBy: likedByUsers,
    });

    await ticket.save();

    res.status(200).json({
      data: ticket,
      status: "success",
    });
  }
);

export { router as updateRouter };
