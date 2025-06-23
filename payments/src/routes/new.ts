import {
  BadRequestError,
  OrderStatus,
  validateRequest,
  verifyToken,
} from "@hrrtickets/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  verifyToken,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.isValidObjectId(req.body.orderId)) {
      return next(new BadRequestError("Order Id is not valid ObjectId", 400));
    }

    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return next(new BadRequestError("Order not found", 404));
    }

    if (order.user !== req.currentUser!.id) {
      return next(
        new BadRequestError("Order is not belong to the current user", 401)
      );
    }

    if (order.status === OrderStatus.Cancelled) {
      return next(new BadRequestError("Cannot pay for a Cancelled order", 400));
    }

    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: req.body.token,
    });

    res.status(201).json({
      status: "success",
      message: "Created new payment",
    });
  }
);

export { router as createPaymentRouter };
