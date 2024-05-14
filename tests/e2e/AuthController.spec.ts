import request from 'supertest';
import { app } from '../../src/index';
import 'dotenv/config';

describe('Auth Controller', () => {
  test('Create Admin', async () => {
    const response: any = await request(app)
      .post('/admin/register')
      .send({ email: 'test@test.com', user: 'test', password: '123' });

    expect(response.status).toBe(200);
  });
});
