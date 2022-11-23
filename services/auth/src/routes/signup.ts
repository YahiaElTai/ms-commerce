import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequest,
  generateToken,
} from '@ms-commerce/common';
import { User, UserDraft } from '../models/user';

const router = express.Router();

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = new User<UserDraft>({ email, password });
    await user.save();

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
