import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@hrrtickets/common";
import { createPaymentRouter } from "./routes/new";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(createPaymentRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
