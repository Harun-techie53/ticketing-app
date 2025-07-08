import { BadRequestError, verifyToken } from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Auction } from "../../models/auction";

const router = express.Router();

router.get(
  "/api/tickets/auctions/all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auctions = await Auction.find().populate({
      path: "ticket",
      select: "id title order",
      populate: {
        path: "order",
        populate: {
          path: "user",
          select: "firstName lastName id",
        },
      },
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
      // Join Ticket
      {
        $lookup: {
          from: "tickets", // collection name
          localField: "ticket",
          foreignField: "_id",
          as: "ticket",
        },
      },
      { $unwind: "$ticket" },

      {
        $lookup: {
          from: "users",
          localField: "ticket.order.user",
          foreignField: "_id",
          as: "ticketUser",
        },
      },

      // Filter by user ID
      // {
      //   $match: {
      //     "ticket.order.user": req.currentUser?.id,
      //   },
      // },
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
    const auction = await Auction.findById(req.params.id)
      .populate({
        path: "ticket",
        populate: {
          path: "order",
          populate: {
            path: "user",
          },
        },
      })
      .populate("bids.user")
      .populate("highestBidder.user");

    if (!auction) {
      return next(new BadRequestError("Auction not found", 404));
    }

    res.status(200).json({
      data: auction,
    });
  }
);

export { router as getAllAuctionsRouter };
