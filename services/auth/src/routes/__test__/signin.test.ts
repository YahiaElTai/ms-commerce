import request from 'supertest';
import { app } from '../../app';
import { generateRandomEmail } from '../../test/test-utils';

it('fails when an email does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: generateRandomEmail(),
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const email = generateRandomEmail();
  await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'incorrectpassword',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const email = generateRandomEmail();
  await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
