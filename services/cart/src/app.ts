import express from 'express';
import compression from 'compression';
import 'express-async-errors';

import { errorHandler, requestLoggerMiddleware } from './middlewares';
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

app.use(requestLoggerMiddleware);

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

app.use(errorHandler);

export { app };
