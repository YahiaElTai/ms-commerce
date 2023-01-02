import request from 'supertest';
import { app } from '../../app';
import { UserSchema } from '../../validators';
import type { FormattedErrors } from '../../validators/types';

describe('when valid email and password are provided', () => {
  it('should respond with 201 and return the created user', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test5@test.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201);

    const validatedUser = UserSchema.parse(response.body);

    expect(validatedUser).toEqual(
      expect.objectContaining({
        email: 'test5@test.com',
        id: validatedUser.id,
        firstName: 'Test',
        lastName: 'User',
      })
    );
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test7@test.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('when incorrect email or password is provided', () => {
  it('should respond with 400 and provide helpful error messages', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test.com',
        password: 'p',
      })
      .expect(400);

    expect(response.body).toHaveLength(2);

    expect(response.body[0]?.message).toBe('Invalid email');
    expect(response.body[1]?.message).toBe(
      'String must contain at least 5 character(s)'
    );
  });

  it('should respond with 400 when both email and password are missing', async () => {
    await request(app).post('/api/users/signup').send({}).expect(400);
  });
});

describe('when email is already in use', () => {
  it('should not allow creating a new user with the same email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test6@test.com',
        password: 'password',
      })
      .expect(201);

    const response: { body: { message: string }[] } = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test6@test.com',
        password: 'password',
      })
      .expect(400);

    expect(response.body[0]?.message).toBe('Email is already in use.');
  });
});
