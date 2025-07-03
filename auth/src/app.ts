import express, { NextFunction, Request, Response } from "express";
import { currentuserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { userRouter } from "./routes/users";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, NotFoundError, verifyToken } from "@hrrtickets/common";

const app = express();

app.use(
  cors({
    origin: "http://localhhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(userRouter);

app.get("/api/users/test", (req: Request, res: Response) => {
  console.log("Test route hit");
  console.log("req.headers", req.headers, "req.cookies", req.cookies);
  res.status(200).send("Test Passed");
});

app.post("/api/users/test", (req: Request, res: Response) => {
  console.log("req.headers", req.headers, "req.cookies", req.cookies);
  res.send("Test POST REQUEST");
});
app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
