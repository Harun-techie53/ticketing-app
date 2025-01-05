import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

const router = express.Router();

router.get(
  "/api/users/all",
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).send({ total: users.length, data: users });
  }
);

export { router as userRouter };
