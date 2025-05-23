import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@hrrtickets/common";
import { createRouter } from "./routes/new";
import { getRouter } from "./routes/view";
import { updateRouter } from "./routes/update";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(updateRouter);
app.use(createRouter);
app.use(getRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
