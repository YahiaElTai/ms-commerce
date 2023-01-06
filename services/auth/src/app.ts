import express from 'express';
import compression from 'compression';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { authenticateRouter } from './routes/authenticate';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';

const app = express();

app.use(compression());
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(authenticateRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
