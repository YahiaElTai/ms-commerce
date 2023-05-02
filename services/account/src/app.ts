import express from 'express';
import compression from 'compression';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import { createMiddleware as createPrometheusMiddleware } from '@promster/express';

import { NotFoundError } from './errors';
import {
  errorHandlerMiddleware,
  requestLoggerMiddleware,
  healthCheckMiddleware,
  authenticationMiddleware,
  proxyMiddlewares,
} from './middlewares';

import { currentUserRouter } from './routes/users/current-user';
import { signinRouter } from './routes/users/signin';
import { signoutRouter } from './routes/users/signout';
import { signupRouter } from './routes/users/signup';
import { CreateProjectRouter } from './routes/projects/create';
import { GetProjectRouter } from './routes/projects/get';
import { DeleteProjectRouter } from './routes/projects/delete';
import { ListProjectsRouter } from './routes/projects/list';
import { UpdateUserRouter } from './routes/users/update-user';

const app = express();

app.use(compression());
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Proxying requests to product and cart services health endpoints that do not require authentication
app.use('/api/products/health', proxyMiddlewares.productProxyMiddleware);
app.use('/api/carts/health', proxyMiddlewares.cartProxyMiddleware);

app.use(healthCheckMiddleware);
app.use(requestLoggerMiddleware);
app.use(createPrometheusMiddleware({ app }));

// account routes that do not require authentication
app.use(signinRouter);
app.use(signupRouter);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(authenticationMiddleware);

// account user routes that require authentication
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(UpdateUserRouter);

// Proxying requests to product and cart services after authentication
app.use(
  '/api/:projectKey/products(/.*)?',
  proxyMiddlewares.productProxyMiddleware
);
app.use('/api/:projectKey/carts(/.*)?', proxyMiddlewares.cartProxyMiddleware);

/*
  Currently endpoints connected to users or projects are without any permissions
  Meaning any user can add or delete projects and assign these projects to different users
  in a real production application, there would be multiple levels of permissions of what users can do
  and what they can access. Adding this would add a lot of complexity to the project which is not desired at the moment.


  Endpoints connected to resources like products and carts and so on are validated.
  Validation happens at the authentication middleware route and then the proxy middleware forwards those requests
  
  At the authentication middleware, we validate that the project exists and that the user has access to it 
*/

// account project routes that require authentication
app.use(CreateProjectRouter);
app.use(GetProjectRouter);
app.use(DeleteProjectRouter);
app.use(ListProjectsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
