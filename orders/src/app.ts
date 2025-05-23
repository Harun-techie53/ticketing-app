import express from "express";
import { errorHandler, NotFoundError } from "@hrrtickets/common";
import { createRouter } from "./routes/new";
import cookieParser from "cookie-parser";
import { viewRouter } from "./routes/view";
import { updateRouter } from "./routes/update";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(createRouter);
app.use(updateRouter);
app.use(viewRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
