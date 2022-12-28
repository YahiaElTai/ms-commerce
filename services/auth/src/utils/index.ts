import jwt from 'jsonwebtoken';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JWTUndefinedError } from '../errors';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    // extract the hashed password from the string
    const [hashedPassword, salt] = storedPassword.split('.');

    // has the supplied password
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

export const generateToken = (id: number, email: string): string => {
  if (!process.env.JWT_KEY) {
    throw new JWTUndefinedError();
  }

  return jwt.sign({ id, email }, process.env.JWT_KEY, {
    expiresIn: '1d',
  });
};
