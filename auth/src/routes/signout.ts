import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/users/signout",
  (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("jwt");
    res.send({});
  }
);

export { router as signoutRouter };
