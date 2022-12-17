import jwt from 'jsonwebtoken';

export const generateToken = (id: number, email: string): string =>
  jwt.sign(
    { id, email },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_KEY!,
    {
      expiresIn: '1d',
    }
  );
