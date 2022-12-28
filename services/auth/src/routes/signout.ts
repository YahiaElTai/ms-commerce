import express, { Response } from 'express';
import { NotAuthorized } from '../errors';
import { IJwtRequest } from '../types';

const router = express.Router();

router.post('/api/users/signout', (req: IJwtRequest, res: Response) => {
  if (!req.cookies.access_token) {
    throw new NotAuthorized('You are currenty not signed in.');
  }

  res
    .clearCookie('access_token')
    .status(200)
    .send([{ message: 'Successfully signed out' }]);
});

export { router as signoutRouter };
