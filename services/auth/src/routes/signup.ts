import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import { prisma } from '../prisma';
import { generateToken } from '../utils';
import { UserSchema } from '../validators';

const router = express.Router();

router.post(
  '/api/users/signup',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { email, password } = UserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('Email is already in use.');
    }

    const user = await prisma.user.create({ data: { email, password } });

    const token = generateToken(user.id, user.email);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .send(user);
  }
);

export { router as signupRouter };
