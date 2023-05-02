import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { CookiesSchema, PayloadSchema } from '../validators';
import {
  BadRequestError,
  JWTUndefinedError,
  NotAuthorized,
  NotFoundError,
} from '../errors';
import { prisma } from '../prisma';

const authenticationMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const requestedUrl = req.url;

  // authenticate request
  const validatedCookies = CookiesSchema.safeParse(req.cookies);

  if (!validatedCookies.success) {
    throw new NotAuthorized();
  }

  if (!process.env['JWT_KEY']) {
    throw new JWTUndefinedError();
  }

  const payload = jwt.verify(
    validatedCookies.data.access_token,
    process.env['JWT_KEY']
  );

  const validatedUser = PayloadSchema.safeParse(payload);

  if (!validatedUser.success) {
    throw new NotAuthorized();
  }

  // validate that project exists and user can access it

  const projectKey = requestedUrl?.split('/')[2];

  // This is required as the account service has this URL
  // /api/account/users/<handler>
  // If the second element is actually `account` then pass to the next middleware
  if (projectKey === 'account') {
    req.headers['UserId'] = validatedUser.data.id;

    next();

    return;
  }

  if (!projectKey) {
    throw new BadRequestError(
      `Please check again that the URL is correct and includes a project key`
    );
  }

  const project = await prisma.project.findUnique({
    where: { key: projectKey },
  });

  if (!project) {
    throw new NotFoundError(
      `Project with key '${projectKey}' could not be found`
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: validatedUser.data.id },
  });

  if (!existingUser) {
    throw new NotFoundError(
      `User with Id '${validatedUser.data.id}' could not be found`
    );
  }

  if (!existingUser.projects.includes(projectKey)) {
    throw new BadRequestError(
      `You do not have access to project with key: ${projectKey}`
    );
  }

  req.headers['UserId'] = validatedUser.data.id;
  req.headers['ProjectKey'] = projectKey;

  next();
};

export default authenticationMiddleware;
