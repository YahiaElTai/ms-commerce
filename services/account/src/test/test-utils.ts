import request from 'supertest';
import { UserSchema } from '../validators';
import { app } from '../app';

export const authenticate = async () => {
  // sign in to get the user id
  const email = generateRandomEmail();
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';

  const response = await request(app)
    .post('/api/account/signup')
    .send({ email, password, firstName, lastName })
    .expect(201);

  const validatedUser = UserSchema.parse(response.body);
  const cookie = response.get('Set-Cookie');

  return { user: validatedUser, cookie };
};

const domains = [
  'gmail',
  'yahoo',
  'hotmail',
  'outlook',
  'aol',
  'icloud',
  'protonmail',
  'mail',
  'zoho',
  'gmx',
];
const tlds = [
  'com',
  'net',
  'org',
  'edu',
  'gov',
  'co.uk',
  'ca',
  'de',
  'jp',
  'fr',
];

export const generateRandomEmail = (): string => {
  const randomDomain = domains[
    Math.floor(Math.random() * domains.length)
  ] as string;
  const randomTld = tlds[Math.floor(Math.random() * tlds.length)] as string;
  const username = Math.random().toString(36).substring(2, 8);

  return `${username}@${randomDomain}.${randomTld}`;
};
