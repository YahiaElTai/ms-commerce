import request from 'supertest';
import { app } from '../../app';
import { UserSchema } from '../../validators';
import { authenticate } from '../../test/test-utils';

describe('when user is authenticated', () => {
  it('should respond with details about current user', async () => {
    const authenticated = await authenticate();

    const response = await request(app)
      .get('/api/account/users/currentuser')
      .set('Cookie', authenticated.cookie)
      .set({
        UserId: authenticated.user.id,
      })
      .send()
      .expect(200);

    const validatedUser = UserSchema.parse(response.body);

    expect(validatedUser).toEqual(
      expect.objectContaining({
        id: authenticated.user.id,
        email: authenticated.user.email,
        firstName: authenticated.user.firstName,
        lastName: authenticated.user.lastName,
      })
    );
  });
});

it('responds with 401 if not authenticated', async () => {
  await request(app).get('/api/account/users/currentuser').send().expect(401);
});
