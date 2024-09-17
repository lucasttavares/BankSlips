import request from 'supertest';
import { app } from '../../src/index';
import HttpStatusCode from '../../src/utils/enum/httpStatusCode';

describe('Auth Controller', () => {
  test('Register and SignIn Admin', async () => {
    await request(app)
      .post('/admin/register')
      .send({ email: 'test@test.com', user: 'test', password: '123' })
      .expect(HttpStatusCode.OK);

    const response: any = await request(app)
      .post('/admin/auth')
      .send({ email: 'test@test.com', password: '123' })
      .expect(HttpStatusCode.OK);

    expect(response.body).toHaveProperty('token');
  });

  test('SingIn with non-existent Admin', async () => {
    const response = await request(app)
      .post('/admin/auth')
      .send({ email: 'admin@notfound.com', password: '123' })
      .expect(HttpStatusCode.NOT_FOUND);

    expect(response.body).toEqual({ error: 'Admin not found' });
  });

  test('Admin signIg with invalid password', async () => {
    const response = await request(app)
      .post('/admin/auth')
      .send({ email: 'test@test.com', password: 'invalidPassword' })
      .expect(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toEqual({ error: 'Invalid password' });
  });

  test('Refresh admin token', async () => {
    const loginResponse = await request(app)
      .post('/admin/auth')
      .send({ email: 'test@test.com', password: '123' })
      .expect(HttpStatusCode.OK);

    const token = loginResponse.body.token;

    const refreshResponse = await request(app)
      .post('/admin/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.OK);

    expect(refreshResponse.body).toHaveProperty('token');
  });
});
