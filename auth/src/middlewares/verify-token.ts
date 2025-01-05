import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { verifyJwtToken } from "../utils/jwtToken";
import { User } from "../models/user";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    return next(new BadRequestError("No token, Authorization Denied!", 404));
  }

  const { userId } = verifyJwtToken(jwtCookie);

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new BadRequestError("User not found", 404));
  }

  req.currentUser = user;

  next();
};
