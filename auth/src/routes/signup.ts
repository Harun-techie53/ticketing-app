import express, { NextFunction, Response, Request } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { UserRegisterDto } from "../types/requestDto";
import {
  BadRequestError,
  getJwtToken,
  UserRoles,
  validateRequest,
} from "@hrrtickets/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("firstName")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Firstname must be between 3 to 20 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Lastname must be between 3 to 20 characters"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters")
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, firstName, lastName, role } =
      req.body as UserRegisterDto;

    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new BadRequestError("Email already in use"));
    }

    const newUser = User.build({ firstName, lastName, email, password, role });
    await newUser.save();

    const userJwt = getJwtToken(newUser.id, newUser.role);

    res.cookie("jwt", userJwt);

    res.status(201).send({ token: userJwt, data: newUser });
  }
);

export { router as signupRouter };
