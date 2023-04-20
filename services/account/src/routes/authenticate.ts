import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWTUndefinedError, NotAuthorized } from '../errors';
import { CookiesSchema, UserSchema } from '../validators';

// These URIs should not be authenticated
const UNAUTHENTICATED_URLS = ['/api/account/signup', '/api/account/signin'];

const router = express.Router();

router.post('/api/account/authenticate', (req: Request, res: Response) => {
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

  try {
    const payload = jwt.verify(
      validatedCookies.data.access_token,
      process.env['JWT_KEY']
    );

    const user = UserSchema.parse(payload);

    return res
      .status(200)
      .set({ UserId: user.id, UserEmail: user.email })
      .send();
  } catch (error) {
    throw new NotAuthorized();
  }
});

export { router as authenticateRouter };
