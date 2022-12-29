import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

const scryptAsync = promisify(scrypt);

export class PasswordHashing {
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

    const validatedSalt = z.string().parse(salt);

    // has the supplied password
    const buf = (await scryptAsync(
      suppliedPassword,
      validatedSalt,
      64
    )) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
