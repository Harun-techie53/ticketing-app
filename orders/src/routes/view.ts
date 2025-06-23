import {
  BadRequestError,
  restrictRoute,
  UserRoles,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/orders",
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
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      return next(new BadRequestError("Order not found", 404));
    }

    if (req.currentUser?.role !== UserRoles.Admin) {
      if (order.user !== req.currentUser!.id) {
        return next(
          new BadRequestError("Order not belong to the current user", 401)
        );
      }
    }

    res.status(200).send({ data: order });
  }
);

router.get(
  "/api/orders/tickets",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find();

    res.status(200).send({ data: tickets });
  }
);

export { router as viewRouter };
