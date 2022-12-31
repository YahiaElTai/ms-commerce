import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test4@test.com',
      password: 'password',
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
