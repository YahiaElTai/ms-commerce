import request from 'supertest';
import { app } from '../../app';
import { Actions, UserSchema } from '../../validators';
import { authenticate } from '../../test/test-utils';
import { TFormattedErrors } from '../../validators/types';

const generateRandomProjectKey = () =>
  [1, 2, 3, 4, 5, 6]
    .map(() => 'abcdefghijklmnopqrstuvwxyz-'[Math.floor(Math.random() * 27)])
    .join('');

const createProject = async (keys: string[], cookie: string[]) => {
  for (const key of keys) {
    await request(app)
      .post('/api/account/projects')
      .set('Cookie', cookie)
      .send({ key })
      .expect(201);
  }
};

describe('when project is found', () => {
  it('should allow adding project to user', async () => {
    const authenticated = await authenticate();

    const projectKey = generateRandomProjectKey();
    await createProject([projectKey], authenticated.cookie);

    const response = await request(app)
      .put(`/api/account/users/${authenticated.user.id}`)
      .set('Cookie', authenticated.cookie)
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
        id: authenticated.user.id,
        email: authenticated.user.email,
        firstName: authenticated.user.firstName,
        lastName: authenticated.user.lastName,
        version: 2,
        projects: [projectKey],
      })
    );
  });
});

describe('when project is not found', () => {
  it('should not allow adding project to user', async () => {
    const authenticated = await authenticate();

    const projectKey = generateRandomProjectKey();

    const response: { body: TFormattedErrors[] } = await request(app)
      .put(`/api/account/users/${authenticated.user.id}`)
      .set('Cookie', authenticated.cookie)
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
