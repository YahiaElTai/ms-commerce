import express, { Request, Response } from 'express';
import { PasswordHashing, generateToken } from '../../utils';
import { prisma } from '../../prisma';
import { BadRequestError } from '../../errors';
import { UserDraftSchema } from '../../validators';

const router = express.Router();

router.post(
  '/api/account/signin',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { email, password } = UserDraftSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordHashing.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Incorrect password');
    }

    const token = generateToken(existingUser.id, existingUser.email);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
      })
      .status(200)
      .send([{ message: 'Successfully signed in' }]);
  }
);

export { router as signinRouter };
