import express, { NextFunction } from "express";
import { validationResult, body } from "express-validator";
import { Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    const { email, password, firstName, lastName } = req.body;

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return next(new BadRequestError("Email already in use"));
    }

    const newUser = User.build({ firstName, lastName, email, password });
    await newUser.save();

    res.status(201).send({ message: "User created", data: newUser });
  }
);

export { router as signupRouter };
