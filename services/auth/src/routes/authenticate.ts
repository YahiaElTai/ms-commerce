import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorized } from '@ms-commerce/common';

interface UserPayload {
  id: string;
  email: string;
}

const router = express.Router();

router.post('/api/users/authenticate', async (req: Request, res: Response) => {
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

    // req.currentUser = { id: payload.id, email: payload.email };
    return res
      .status(200)
      .set({ UserId: payload.id, UserEmail: payload.email })
      .send();
  } catch (error) {
    throw new NotAuthorized();
  }
});

export { router as authenticateRouter };
