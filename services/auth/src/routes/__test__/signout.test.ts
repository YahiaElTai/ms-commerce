import request from 'supertest';
import { app } from '../../app';
import { generateRandomEmail } from '../../test/test-utils';

it('clears the cookie after signing out', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: generateRandomEmail(),
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  const responseSignOut: { body: { message: string }[] } = await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(responseSignOut.body[0]?.message).toEqual('Successfully signed out');
});
