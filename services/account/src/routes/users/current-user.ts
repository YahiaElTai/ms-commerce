import { NotAuthorized } from '../../errors';
import express, { Request, Response } from 'express';
import { excludePasswordFromUser, prisma } from '../../prisma';
import { IdParamSchema } from '../../validators';

const router = express.Router();

router.get(
  '/api/account/users/currentuser',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const id = req.headers['UserId'];

    const parsedId = IdParamSchema.safeParse({ id });

    if (!parsedId.success) {
      throw new NotAuthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId.data.id },
      select: excludePasswordFromUser,
    });

    if (!user) {
      throw new NotAuthorized();
    }

    res.status(200).send(user);
  }
);

export { router as currentUserRouter };
