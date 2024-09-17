import AdminRepository from '../../src/database/AdminRepository';
import AdminServices from '../../src/services/AdminServices';
import TokenManipulator from '../../src/utils/tokenManipulator';

let repository: AdminRepository;

jest.mock('../../src/database/AdminRepository', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findByEmail: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/utils/tokenManipulator');

describe('Admin Service', () => {
  beforeEach(() => {
    repository = new AdminRepository();
    jest.clearAllMocks();
  });

  test('Verify Admin Credentials', async () => {
    const admin = {
      email: 'admin@admin.com',
      user: 'admin',
      password: '123',
    };
    const services = new AdminServices();
    jest.spyOn(repository, 'findByEmail').mockResolvedValue([admin]);

    await services.verifyAdminCredentials(admin.email, admin.password);

    expect(repository.findByEmail).toHaveBeenCalledTimes(1);
    expect(TokenManipulator.generateToken).toHaveBeenCalledTimes(1);
    expect(TokenManipulator.generateToken).toHaveBeenCalledWith(admin.email);
  });

  test('Verify Admin Credentials Error Admin not found', async () => {
    repository.findByEmail = jest.fn().mockResolvedValue([]);
    try {
      const services = new AdminServices();
      await services.verifyAdminCredentials('test@test.com', 'test');
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({ error: 'Admin not found' });
    }
  });

  test('Verify Admin Credentials Error Invalid password', async () => {
    const adminEmail = 'admin@example.com';

    repository.findByEmail = jest
      .fn()
      .mockResolvedValue([{ email: adminEmail, password: 'correctPassword' }]);

    try {
      const services = new AdminServices();
      await services.verifyAdminCredentials(adminEmail, 'invalidPassword');
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({ error: 'Invalid password' });
    }
  });
});
