import db from '../model/connection/connection';
import AdminDao from '../model/dao/adminDao';

jest.mock('../model/connection/connection', () => ({
  insert: jest.fn(),
}));

describe('AdminDao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Add Admin', async () => {
    const admin: AdminDao = {
      email: 'test@test.com',
      user: 'test',
      password: '123',
    };

    await AdminDao.add(admin);

    expect(db('admin').insert).toHaveBeenCalledTimes(1);
    expect(db('admin').insert).toHaveBeenCalledWith(admin);
  });
});
