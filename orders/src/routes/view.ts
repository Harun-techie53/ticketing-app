import {
  BadRequestError,
  restrictRoute,
  UserRoles,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/orders/me",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ user: req.currentUser?.id }).populate(
      "ticket"
    );

    res.status(200).send({ data: orders });
  }
);

router.get(
  "/api/orders/all",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  async (req: Request, res: Response, NextFunction) => {
    const orders = await Order.find();

    res.status(200).json({
      data: orders,
    });
  }
);

router.get(
  "/api/orders/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const {id: orderId} = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return next(new BadRequestError("Id is not valid", 400));
    }

    const order = await Order.findById(orderId).populate("ticket");

    
    if (!order) {
      return next(new BadRequestError("Order not found", 404));
    }

    if(req.currentUser?.id !== order.user && req.currentUser?.role !== UserRoles.Admin) {
      return next(new BadRequestError("Not authorized to access order", 401));
    }

    res.status(200).send({ data: order });
  }
);

router.get(
  "/api/orders/tickets/:id",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: ticketId } = req.params;

    if (!mongoose.isValidObjectId(ticketId)) {
      return next(new BadRequestError("Id is not valid", 400));
    }

    const orders = await Order.find({ ticket: ticketId });

    res.status(200).send({ data: orders });
  }
);

export { router as viewRouter };
