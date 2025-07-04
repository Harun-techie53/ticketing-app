import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@hrrtickets/common";
import { createRouter } from "./routes/new";
import { getRouter } from "./routes/view";
import { updateRouter } from "./routes/update";
import { createAuctionRouter } from "./routes/auction/new";
import { updateAuctionRouter } from "./routes/auction/update";
import { getAllAuctionsRouter } from "./routes/auction/view";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path !== "/" && req.path !== "/socket.io/") {
    console.log(`[${req.method}] ${req.path}`);
  }
  next();
});

app.use(updateRouter);
app.use(createRouter);
app.use(createAuctionRouter);
app.use(updateAuctionRouter);
app.use(getAllAuctionsRouter);
app.use(getRouter);

app.get("/api/tickets/test/hello", (req, res, next) => {
  res.send("HELLO");
});

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
