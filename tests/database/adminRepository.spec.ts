import AdminRepository from '../../src/database/AdminRepository';
import db from '../../src/infra/connection';

let repository: AdminRepository;

jest.mock('../../src/infra/connection', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  }),
}));

describe('AdminRepository', () => {
  beforeEach(() => {
    repository = new AdminRepository();
    jest.clearAllMocks();
  });

  test('add', async () => {
    const admin: any = {
      email: 'admin@admin.com',
      user: 'admin',
      password: '123',
    };

    await repository.add(admin);

    expect(db().insert).toHaveBeenCalledWith(admin);
    expect(db().insert).toHaveBeenCalledTimes(1);
  });

  test('findByEmail', async () => {
    const admin: any = {
      email: 'admin@admin.com',
      user: 'admin',
      password: 'password123',
    };

    jest.spyOn(db(), 'select').mockReturnThis();
    jest.spyOn(db(), 'where').mockResolvedValue(admin);

    const result = await repository.findByEmail(admin.email);

    expect(result).toEqual(admin);
    expect(db().select).toHaveBeenCalledWith('*');
    expect(db().where).toHaveBeenCalledWith({ email: admin.email });
    expect(db().select).toHaveBeenCalledTimes(1);
  });
});
