import jwt from 'jsonwebtoken';
import { JWTUndefinedError } from '../errors';

export const generateToken = (id: number, email: string): string => {
  if (!process.env['JWT_KEY']) {
    throw new JWTUndefinedError();
  }

  return jwt.sign({ id, email }, process.env['JWT_KEY'], {
    expiresIn: '1d',
  });
};
