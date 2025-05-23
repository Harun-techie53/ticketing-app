import { verifyToken } from "@hrrtickets/common";
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
  "/api/orders/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate("ticket");

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
