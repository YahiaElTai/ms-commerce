import request from 'supertest';
import { app } from '../../app';

const authenticate = async () => {
  // sign in to get the cookie
  const email = 'test@test.com';
  const password = 'password';

  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = signupResponse.get('Set-Cookie');

  // authenticate with the cookie
  const authenticateResponse = await request(app)
    .post('/api/users/authenticate')
    .set('Cookie', cookie)
    .set('x-original-uri', '/api/users/currentuser')
    .send()
    .expect(200);

  const userId = authenticateResponse.get('UserId');
  const userEmail = authenticateResponse.get('UserEmail');

  return { userId, userEmail };
};

it('responds with details about current user', async () => {
  const user = await authenticate();

  const respone = await request(app)
    .get('/api/users/currentuser')
    .set({ UserId: user.userId, UserEmail: user.userEmail })
    .send()
    .expect(200);

  expect(respone.body.user.email).toEqual('test@test.com');
});

it('responds with 401 if not authenticated', async () => {
  await request(app).get('/api/users/currentuser').send().expect(401);
});
