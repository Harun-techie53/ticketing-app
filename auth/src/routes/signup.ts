import express from "express";
import { validationResult, body } from "express-validator";
import { Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  (req: Request, res: Response): any => {
    const errors = validationResult(req);

    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      throw new Error("Validation error occured");
    }

    console.log("Creating a user");
    throw new Error("Error connecting to database");
    res.send({});
  }
);

export { router as signupRouter };
