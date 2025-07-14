import { APIFeatures, BadRequestError, verifyToken } from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Auction } from "../../models/auction";

const router = express.Router();

router.get(
  "/api/tickets/auctions/all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const featureQuery = new APIFeatures(
      Auction.find().populate([
        {
          path: "ticket",
          select: "id title order",
          populate: {
            path: "order",
            populate: {
              path: "user",
              select: "firstName lastName id",
            },
          },
        },
        {
          path: "raisedBy",
          select: "firstName lastName",
        },
      ]),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const auctions = await featureQuery.getQuery();
    const totalDocumentsCount = await featureQuery.getTotalCount();

    res.status(200).json({
      data: {
        auctions,
        totalDocumentsCount,
      },
    });
  }
);

router.get(
  "/api/tickets/auctions/currentUser",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auctions = await Auction.find({
      raisedBy: req.currentUser?.id,
    }).populate({
      path: "ticket",
    });

    const totalDocumentsCount = await Auction.find({
      raisedBy: req.currentUser?.id,
    })
      .populate({
        path: "ticket",
      })
      .countDocuments();

    res.status(200).json({
      data: {
        auctions,
        totalDocumentsCount,
      },
    });
  }
);

router.get(
  "/api/tickets/auctions/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const auction = await Auction.findById(req.params.id)
      .populate([
        {
          path: "ticket",
          populate: {
            path: "order",
            populate: {
              path: "user",
            },
          },
        },
        {
          path: "raisedBy",
        },
      ])
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
