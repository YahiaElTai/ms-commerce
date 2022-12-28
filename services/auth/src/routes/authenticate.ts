import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTUndefinedError, NotAuthorized } from '../errors';
import { IJwtRequest, UserPayload } from '../types';

// These URIs should not be authenticated
const UNAUTHENTICATED_URLS = ['/api/users/signup', '/api/users/signin'];

const router = express.Router();

router.post('/api/users/authenticate', (req: IJwtRequest, res: Response) => {
  const originalURI = req.header('x-original-uri');

  if (originalURI && UNAUTHENTICATED_URLS.includes(originalURI)) {
    return res.status(200).send();
  }

  if (!req.cookies.access_token) {
    throw new NotAuthorized();
  }

  if (!process.env.JWT_KEY) {
    throw new JWTUndefinedError();
  }

  try {
    const payload = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_KEY
    ) as UserPayload;

    return res
      .status(200)
      .set({ UserId: payload.id, UserEmail: payload.email })
      .send();
  } catch (error) {
    throw new NotAuthorized();
  }
});

export { router as authenticateRouter };
