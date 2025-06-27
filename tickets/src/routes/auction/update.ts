import {
  BadRequestError,
  validateRequest,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Auction, AuctionStatusType, BidDoc } from "../../models/auction";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/tickets/auctions/:id",
  verifyToken,
  [body("price").not().isEmpty().isNumeric()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { price } = req.body;
    const { id: auctionId } = req.params;

    if (!mongoose.isValidObjectId(auctionId)) {
      return next(new BadRequestError("Id is not valid", 400));
    }

    const auction = await Auction.findById(auctionId).populate("ticket");

    if (!auction) {
      return next(new BadRequestError("Auction is not found", 404));
    }

    if (
      req.currentUser?.id.toString() === auction.ticket.order.user.toString()
    ) {
      return next(
        new BadRequestError("Cannot bid on your auction ticket", 400)
      );
    }

    if (price < auction.basePrice) {
      return next(
        new BadRequestError("Bid price cannot be less than the base price", 400)
      );
    }

    if (auction.status === AuctionStatusType.Inactive) {
      return next(new BadRequestError("Auction is not active anymore", 400));
    }

    const bid = {
      userId: req.currentUser?.id.toString()!,
      price,
      placedAt: new Date(),
    };

    let highestBidder;

    if (!auction.highestBidder) {
      highestBidder = bid;
    } else {
      if (price > auction.highestBidder.price) {
        highestBidder = bid;
      } else {
        highestBidder = auction.highestBidder;
      }
    }

    auction.set({
      highestBidder,
      bids: [...auction.bids, bid],
    });

    await auction.save();

    res.status(200).json({
      data: auction,
    });
  }
);

export { router as updateAuctionRouter };
