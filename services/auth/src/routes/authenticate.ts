import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorized } from '@ms-commerce/common';

interface UserPayload {
  id: string;
  email: string;
}

// These URIs should not be authenticated
const UNAUTHENTICATED_URLS = ['/api/users/signup', '/api/users/signin'];

const router = express.Router();

router.post('/api/users/authenticate', async (req: Request, res: Response) => {
  const originalURI = req.header('x-original-uri');

  if (originalURI && UNAUTHENTICATED_URLS.includes(originalURI)) {
    return res.status(200).send();
  }

  if (!req.cookies.access_token) {
    throw new NotAuthorized();
  }

  // jwt.verify will throw an error if the jwt token is invalid
  try {
    const payload = jwt.verify(
      req.cookies.access_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_KEY!
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
