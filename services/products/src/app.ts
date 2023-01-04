import express from 'express';
import 'express-async-errors';

import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

import { CreateProductRouter } from './routes/create';
import { ListProductsRouter } from './routes/list';
import { GetProductRouter } from './routes/get';
import { DeleteProductRouter } from './routes/delete';
import { DeleteProductsRouter } from './routes/delete-all';
import { UpdateProductRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(CreateProductRouter);
app.use(ListProductsRouter);
app.use(GetProductRouter);
app.use(DeleteProductRouter);
app.use(DeleteProductsRouter);
app.use(UpdateProductRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
