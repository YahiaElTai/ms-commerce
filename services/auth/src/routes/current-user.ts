import { NotAuthorized } from '../errors';
import express, { Request, Response } from 'express';
import { excludePasswordFromUser, prisma } from '../prisma';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/users/currentuser', async (req: Request, res: Response) => {
  const id = req.header('UserId');
  const email = req.header('UserEmail');

  if (!id || !email) {
    throw new NotAuthorized();
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: excludePasswordFromUser,
  });

  res.status(200).send(user);
});

export { router as currentUserRouter };
