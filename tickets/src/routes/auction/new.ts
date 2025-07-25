import {
  BadRequestError,
  validateRequest,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../../models/tickets";
import { Auction, AuctionStatusType } from "../../models/auction";
import { AuctionCreatedPublisher } from "../../events/publishers/auction-created-publisher";
import { natsClient } from "../../nats-client";
import { User } from "../../models/user";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/tickets/auctions",
  verifyToken,
  [body("ticketId").not().isEmpty(), body("basePrice").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId, basePrice } = req.body;
    let { expiresAt } = req.body;
    if (!mongoose.isValidObjectId(ticketId)) {
      return next(new BadRequestError("Ticket Id is not valid", 400));
    }

    const ticket = await Ticket.findById(ticketId).populate("order.user");

    if (!ticket) {
      return next(new BadRequestError("Ticket not found", 404));
    }

    if (!ticket.order) {
      return next(new BadRequestError("Ticket is not ordered yet", 400));
    }

    if (req.currentUser?.id !== ticket.order.user.id) {
      return next(new BadRequestError("Ticket not belong to the user", 401));
    }

    if (basePrice > ticket.maxResalePrice) {
      return next(
        new BadRequestError(
          "Base price cannot be greater than max resale price",
          400
        )
      );
    }

    const user = await User.findById(ticket.order.user.id);

    if (!expiresAt) {
      expiresAt = new Date();

      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    }

    const auction = Auction.build({
      ticket,
      expiresAt,
      status: AuctionStatusType.Active,
      basePrice,
      raisedBy: user!,
    });

    await auction.save();

    new AuctionCreatedPublisher(natsClient.client).publish({
      id: auction.id,
      expiresAt,
    });

    res.status(201).json({
      data: {
        ...auction,
        createdBy: user,
      },
    });
  }
);

export { router as createAuctionRouter };
