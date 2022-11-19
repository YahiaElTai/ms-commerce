import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { CartsRouter } from "./routes/list";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@ms-commerce/common";
import { SingleCartRouter } from "./routes/single";
import { CreateCartRouter } from "./routes/create";
import { UpdateCartRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());

app.use(CartsRouter);
app.use(SingleCartRouter);

app.use(CreateCartRouter);
app.use(UpdateCartRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
