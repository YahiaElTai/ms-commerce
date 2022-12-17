import { NotAuthorized } from '@ms-commerce/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req: Request, res: Response) => {
  const id = req.header('UserId');
  const email = req.header('UserEmail');

  if (!id || !email) {
    throw new NotAuthorized();
  }

  res.status(200).send({ user: { id, email } });
});

export { router as currentUserRouter };
