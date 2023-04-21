import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
  JWTUndefinedError,
  NotAuthorized,
  NotFoundError,
} from '../../errors';
import { CookiesSchema, PayloadSchema } from '../../validators';
import { prisma } from '../../prisma';

// These URIs should not be authenticated
const UNAUTHENTICATED_URLS = ['/api/account/signup', '/api/account/signin'];

const router = express.Router();

router.post(
  '/api/account/authenticate',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const originalURI = req.header('x-original-uri');

    if (originalURI && UNAUTHENTICATED_URLS.includes(originalURI)) {
      return res.status(200).send();
    }

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

    // if URL contains project key, verify that it exists and the user has access to it
    const URLSegment = originalURI?.split('/')[2]; // can either be `account` or `:projectKey`

    if (URLSegment && URLSegment !== 'account') {
      const project = await prisma.project.findUnique({
        where: { key: URLSegment },
      });

      if (!project) {
        throw new NotFoundError(
          `Project with key '${URLSegment}' could not be found`
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

      if (!existingUser.projects.includes(URLSegment)) {
        throw new BadRequestError(
          `You do not have access to project with key: ${URLSegment}`
        );
      }
    }

    return res
      .status(200)
      .set({
        UserId: validatedUser.data.id,
        UserEmail: validatedUser.data.email,
      })
      .send();
  }
);

export { router as authenticateRouter };
