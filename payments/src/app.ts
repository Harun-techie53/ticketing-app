import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@hrrtickets/common";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/api/payments", (req, res) => {
  res.send("Hello from payment service");
});

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
