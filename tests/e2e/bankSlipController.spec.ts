import request from 'supertest';
import { app } from '../../src/index';
import HttpStatusCode from '../../src/utils/enum/httpStatusCode';

let token: string;
let slipId: string;

describe('BanlSlip Controller', () => {
  beforeAll(async () => {
    //register and signin admin
    await request(app)
      .post('/admin/register')
      .send({ email: 'newadmintest@test.com', user: 'test', password: '123' })
      .expect(HttpStatusCode.OK);

    const loginResponse = await request(app)
      .post('/admin/auth')
      .send({ email: 'newadmintest@test.com', password: '123' })
      .expect(HttpStatusCode.OK);

    token = loginResponse.body.token;

    //post slip
    const slipResponse = await request(app)
      .post('/rest/bankslips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        total_in_cents: 100,
        due_date: '2024-01-10',
        customer: 'A',
      })
      .expect(HttpStatusCode.CREATED);

    slipId = slipResponse.body.id;
  });

  test('Post Slip', async () => {
    const response = await request(app)
      .post('/rest/bankslips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        total_in_cents: 100,
        due_date: '2024-01-10',
        customer: 'A',
      })
      .expect(HttpStatusCode.CREATED);

    expect(response.body).toHaveProperty('id');

    slipId = response.body.id;
  });

  test('Post Slip wihtout body', async () => {
    const response = await request(app)
      .post('/rest/bankslips')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toEqual({
      error: 'Bankslip not provided in the request body',
    });
  });

  test('Post Slip with invalid body', async () => {
    const response = await request(app)
      .post('/rest/bankslips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        total_in_cents: '100',
        due_date: '2024-01-10',
        customer: 'C',
      })
      .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

    expect(response.body).toEqual({
      error:
        'Invalid bankslip provided. The possible reasons are: A field of the provided bankslip was null or with invalid values',
    });
  });

  test('Get all Slips', async () => {
    const response: any = await request(app)
      .get('/rest/bankslips')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.OK);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Get Slip by Id', async () => {
    const response = await request(app)
      .get(`/rest/bankslips/${slipId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.OK);

    expect(response.body).toHaveProperty('id', slipId);
    expect(response.body).toHaveProperty('fine');
    expect(typeof response.body.fine).toBe('number');
  });

  test('Get Slip by Id with not founded id', async () => {
    const fakeId = '123';
    const response = await request(app)
      .get(`/rest/bankslips/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.NOT_FOUND);

    expect(response.body).toEqual({
      error: `Failed to calculate fine for slip with id ${fakeId}: Bankslip not found with the specified id: ${fakeId}`,
    });
  });

  test('Pay Slip', async () => {
    await request(app)
      .post(`/rest/bankslips/${slipId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payment_date: '2024-01-09' })
      .expect(HttpStatusCode.NO_CONTENT);
  });

  test('Pay Slip with not founded id', async () => {
    const fakeId = '123';
    const response = await request(app)
      .post(`/rest/bankslips/${fakeId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payment_date: '2024-01-09' })
      .expect(HttpStatusCode.NOT_FOUND);

    expect(response.body).toEqual({
      error: 'Bankslip not found with the specified id',
    });
  });

  test('Cancel Slip', async () => {
    await request(app)
      .delete(`/rest/bankslips/${slipId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.NO_CONTENT);
  });

  test('Cancel Slip', async () => {
    const fakeId = '123';
    const response = await request(app)
      .delete(`/rest/bankslips/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatusCode.NOT_FOUND);

    expect(response.body).toEqual({
      error: 'Bankslip not found with the specified id',
    });
  });
});
