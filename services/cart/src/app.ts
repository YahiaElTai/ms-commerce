import express from 'express';
import 'express-async-errors';
import { CartsRouter } from './routes/list';
import { GetCartRouter } from './routes/get';
import { CreateCartRouter } from './routes/create';
import { UpdateCartRouter } from './routes/update';
import { DeleteCartsRouter } from './routes/delete';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(CartsRouter);
app.use(GetCartRouter);
app.use(CreateCartRouter);
app.use(UpdateCartRouter);
app.use(DeleteCartsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
