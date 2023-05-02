import express from 'express';
import compression from 'compression';
import 'express-async-errors';
import { createMiddleware as createPrometheusMiddleware } from '@promster/express';

import {
  errorHandlerMiddleware,
  requestLoggerMiddleware,
  healthCheckMiddleware,
} from './middlewares';
import { NotFoundError } from './errors';

import { ListCartsRouter } from './routes/list';
import { GetCartRouter } from './routes/get';
import { CreateCartRouter } from './routes/create';
import { UpdateCartRouter } from './routes/update';
import { DeleteCartsRouter } from './routes/delete-all';
import { DeleteCartRouter } from './routes/delete';
import { ListProductsRouter } from './routes/list-products';

import './kafka/consumer';

const app = express();
app.use(compression());

app.set('trust proxy', true);
app.use(express.json());

app.use(healthCheckMiddleware);
app.use(requestLoggerMiddleware);
app.use(createPrometheusMiddleware({ app }));

app.use(ListCartsRouter);
app.use(ListProductsRouter);
app.use(GetCartRouter);
app.use(CreateCartRouter);
app.use(UpdateCartRouter);
app.use(DeleteCartsRouter);
app.use(DeleteCartRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
