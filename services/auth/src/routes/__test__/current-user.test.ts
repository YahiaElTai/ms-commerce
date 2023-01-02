import request from 'supertest';
import { app } from '../../app';
import { UserSchema } from '../../validators';

const authenticate = async () => {
  // sign in to get the cookie
  const email = 'test3@test.com';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';

  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({ email, password, firstName, lastName })
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

  return { userId, userEmail, firstName, lastName };
};

describe('when user is authenticated', () => {
  it('should respond with details about current user', async () => {
    const user = await authenticate();

    const response = await request(app)
      .get('/api/users/currentuser')
      .set({ UserId: user.userId, UserEmail: user.userEmail })
      .send()
      .expect(200);

    const validatedUser = UserSchema.parse(response.body);

    expect(validatedUser).toEqual(
      expect.objectContaining({
        id: parseInt(user.userId),
        email: user.userEmail,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    );
  });
});

it('responds with 401 if not authenticated', async () => {
  await request(app).get('/api/users/currentuser').send().expect(401);
});
