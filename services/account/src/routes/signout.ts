import express, { Response, Request } from 'express';
import { NotAuthorized } from '../errors';
import { CookiesSchema } from '../validators';

const router = express.Router();

router.post('/api/account/signout', (req: Request, res: Response) => {
  const validatedCookies = CookiesSchema.safeParse(req.cookies);

  if (!validatedCookies.success) {
    throw new NotAuthorized('You are currenty not signed in.');
  }

  res
    .clearCookie('access_token')
    .status(200)
    .send([{ message: 'Successfully signed out' }]);
});

export { router as signoutRouter };
