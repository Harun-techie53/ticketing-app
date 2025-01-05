import express, { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/types";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import bcrypt from "bcryptjs";
import { getJwtToken } from "../utils/generateJwtToken";
import { validateRequest } from "../middlewares/validate-request";
import { body } from "express-validator";

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
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new BadRequestError("Invalid credentials!"));
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return next(new BadRequestError("Invalid credentials!"));
    }

    const userJwt = getJwtToken(user.id);

    res.cookie("jwt", userJwt);

    res.status(200).send({ token: userJwt, data: user });
  }
);

export { router as signinRouter };
