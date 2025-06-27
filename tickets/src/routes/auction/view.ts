import {
  BadRequestError,
  restrictRoute,
  UserRoles,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Auction } from "../../models/auction";

const router = express.Router();

router.get(
  "/api/tickets/auctions/all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auctions = await Auction.find().populate({
      path: "ticket",
      select: "id order",
    });

    res.status(200).json({
      data: auctions,
    });
  }
);

router.get(
  "/api/tickets/auctions/currentUser",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auctions = await Auction.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticket",
          foreignField: "_id",
          as: "ticket",
        },
      },
      { $unwind: "$ticket" },
      {
        $match: {
          "ticket.order.user": req.currentUser?.id,
        },
      },
      {
        $addFields: {
          id: "$_id",
          "ticket.id": "$ticket._id",
        },
      },
      {
        $project: {
          _id: 0,
          "ticket._id": 0,
          "ticket.title": 0,
          "ticket.price": 0,
          "ticket.description": 0,
        },
      },
    ]);

    res.status(200).json({
      data: auctions,
    });
  }
);

router.get(
  "/api/tickets/auctions/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auction = await Auction.findById(req.params.id).populate("ticket");

    if (!auction) {
      return next(new BadRequestError("Auction not found", 404));
    }

    res.status(200).json({
      data: auction,
    });
  }
);

export { router as getAllAuctionsRouter };
