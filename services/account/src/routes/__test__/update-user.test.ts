import request from 'supertest';
import { app } from '../../app';
import { Actions, UserSchema } from '../../validators';
import { generateRandomEmail } from '../../test/test-utils';
import { TFormattedErrors } from '../../validators/types';

const generateRandomProjectKey = () =>
  [1, 2, 3, 4, 5, 6]
    .map(() => 'abcdefghijklmnopqrstuvwxyz-'[Math.floor(Math.random() * 27)])
    .join('');

const authenticate = async () => {
  // sign in to get the cookie
  const email = generateRandomEmail();
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';

  const signupResponse = await request(app)
    .post('/api/account/signup')
    .send({ email, password, firstName, lastName })
    .expect(201);

  const cookie = signupResponse.get('Set-Cookie');

  // authenticate with the cookie
  const authenticateResponse = await request(app)
    .post('/api/account/authenticate')
    .set('Cookie', cookie)
    .set('x-original-uri', '/api/account/users/currentuser')
    .send()
    .expect(200);

  const userId = authenticateResponse.get('UserId');
  const userEmail = authenticateResponse.get('UserEmail');

  return { userId, userEmail, firstName, lastName };
};

const createProject = async (keys: string[]) => {
  for (const key of keys) {
    await request(app).post('/api/account/projects').send({ key }).expect(201);
  }
};

describe('when project is found', () => {
  it('should allow adding project to user', async () => {
    const user = await authenticate();

    const projectKey = generateRandomProjectKey();
    await createProject([projectKey]);

    const response = await request(app)
      .put(`/api/account/users/${user.userId}`)
      .send({
        version: 1,
        action: {
          type: Actions.Enum.addProject,
          value: {
            key: projectKey,
          },
        },
      })
      .expect(200);

    const validatedUser = UserSchema.parse(response.body);

    expect(validatedUser).toEqual(
      expect.objectContaining({
        id: parseInt(user.userId),
        email: user.userEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        version: 2,
        projects: [projectKey],
      })
    );
  });
});

describe('when project is not found', () => {
  it('should not allow adding project to user', async () => {
    const user = await authenticate();

    const projectKey = generateRandomProjectKey();

    const response: { body: TFormattedErrors[] } = await request(app)
      .put(`/api/account/users/${user.userId}`)
      .send({
        version: 1,
        action: {
          type: Actions.Enum.addProject,
          value: {
            key: projectKey,
          },
        },
      })
      .expect(404);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]?.message).toBe(
      `Project with key '${projectKey}' could not be found`
    );
  });
});
