import express from 'express';
import compression from 'compression';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

import { currentUserRouter } from './routes/users/current-user';
import { signinRouter } from './routes/users/signin';
import { signoutRouter } from './routes/users/signout';
import { signupRouter } from './routes/users/signup';
import { authenticateRouter } from './routes/users/authenticate';
import { CreateProjectRouter } from './routes/projects/create';
import { GetProjectRouter } from './routes/projects/get';
import { DeleteProjectRouter } from './routes/projects/delete';
import { ListProjectsRouter } from './routes/projects/list';
import { NotFoundError } from './errors';
import {
  errorHandlerMiddleware,
  requestLoggerMiddleware,
  healthCheckMiddleware,
} from './middlewares';
import { UpdateUserRouter } from './routes/users/update-user';

const app = express();

app.use(compression());
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use(requestLoggerMiddleware);
app.use(healthCheckMiddleware);

// user
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(authenticateRouter);
app.use(UpdateUserRouter);

/*
  Currently endpoints connected to users or projects are without any permissions
  Meaning any user can add or delete projects and assign these projects to different users
  in a real production application, there would be multiple levels of permissions of what users can do
  and what they can access. Adding this would add a lot of complexity to the project which is not desired at the moment.


  Endpoints connected to resources like products and carts and so on are validated 
  Validation happens on /authenticate route which is where the ingress redirects all requests first and if
  /authenticate returns 200 then the request is passed to the original destination
  
  On /authenticate we validate that the project exists and that the user has access to it 
  if so then return 200, and if not we return 400
*/

// project
app.use(CreateProjectRouter);
app.use(GetProjectRouter);
app.use(DeleteProjectRouter);
app.use(ListProjectsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
