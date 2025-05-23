import express, { NextFunction, Request, Response } from "express";
import { User, UserDoc } from "../models/user";
import { restrictRoute, UserRoles, verifyToken } from "@hrrtickets/common";

const router = express.Router();

router.get(
  "/api/users/all",
  verifyToken,
  restrictRoute([UserRoles.Admin]),
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).send({ total: users.length, data: users });
  }
);

export { router as userRouter };
