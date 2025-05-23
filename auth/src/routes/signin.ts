import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { UserLoginDto } from "../types/requestDto";
import {
  BadRequestError,
  validateRequest,
  getJwtToken,
} from "@hrrtickets/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserLoginDto;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new BadRequestError("Invalid credentials!"));
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return next(new BadRequestError("Invalid credentials!"));
    }

    const userJwt = getJwtToken(user.id, user.role);

    res.cookie("jwt", userJwt);

    res.status(200).send({ token: userJwt, data: user });
  }
);

export { router as signinRouter };
