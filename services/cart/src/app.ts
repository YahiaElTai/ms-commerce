import express from 'express';
import 'express-async-errors';

import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

import { ListCartsRouter } from './routes/list';
import { GetCartRouter } from './routes/get';
import { CreateCartRouter } from './routes/create';
import { UpdateCartRouter } from './routes/update';
import { DeleteCartsRouter } from './routes/delete-all';
import { DeleteCartRouter } from './routes/delete';

import { CreateProductRouter } from './routes/products/create';
import { ProductsRouter } from './routes/products/list';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(ListCartsRouter);
app.use(GetCartRouter);
app.use(CreateCartRouter);
app.use(UpdateCartRouter);
app.use(DeleteCartsRouter);
app.use(DeleteCartRouter);

// products routes as a temp solution here until product service is built and can start publishing events
app.use(CreateProductRouter);
app.use(ProductsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
