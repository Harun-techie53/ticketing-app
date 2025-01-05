import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from "../middlewares/verify-token";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUser = req.currentUser;
    res.status(200).send({ data: currentUser });
  }
);

export { router as currentuserRouter };
