import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { verifyToken } from "@hrrtickets/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUser = await User.findById(req.currentUser?.id);
    res.status(200).send({ data: currentUser });
  }
);

export { router as currentuserRouter };
