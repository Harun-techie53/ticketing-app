import express, { NextFunction, Request, Response } from "express";
import { User, UserDoc } from "../models/user";
import {
  BadRequestError,
  restrictRoute,
  UserRoles,
  verifyToken,
} from "@hrrtickets/common";

const router = express.Router();

router.get(
  "/api/users/all",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).send({ data: users });
  }
);

router.get(
  "/api/users/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      next(new BadRequestError("User not found"));
    }

    res.status(200).send({ data: user });
  }
);

export { router as userRouter };
