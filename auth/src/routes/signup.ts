import express, { NextFunction } from "express";
import { body } from "express-validator";
import { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { getJwtToken } from "../utils/generateJwtToken";
import { validateRequest } from "../middlewares/validate-request";

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
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, firstName, lastName } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new BadRequestError("Email already in use"));
    }

    const newUser = User.build({ firstName, lastName, email, password });
    await newUser.save();

    const userJwt = getJwtToken(newUser.id);

    res.cookie("jwt", userJwt);

    res.status(201).send({ token: userJwt, data: newUser });
  }
);

export { router as signupRouter };
