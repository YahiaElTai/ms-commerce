import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequest,
  generateToken,
} from '@ms-commerce/common';
import { prisma } from '../prisma';
import { Password } from '../services/password';
import { Prisma } from '@prisma/client';

const router = express.Router();

interface User {
  id: number;
  email: string;
  password: string;
}

const hashingMiddlware: Prisma.Middleware<User> = async (params, next) => {
  if (params.action === 'create' && params.model === 'User') {
    const hashed = await Password.toHash(params.args.data.password);

    params.args.data.password = hashed;
  }

  const result = await next(params);

  return result;
};

prisma.$use(hashingMiddlware);

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = await prisma.user.create({ data: { email, password } });

    const token = generateToken(user.id, user.email);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json(user);
  }
);

export { router as signupRouter };
