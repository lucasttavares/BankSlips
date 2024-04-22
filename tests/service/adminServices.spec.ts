import AdminRepository from '../../src/database/AdminRepository';
import AdminServices from '../../src/services/AdminServices';
import TokenManipulator from '../../src/utils/tokenManipulator';

let repository: AdminRepository;
let services: AdminServices;

jest.mock('../../src/database/AdminRepository', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findByEmail: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/services/AdminServices', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    verifyAdminCredentials: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/utils/tokenManipulator');

describe('Admin Service', () => {
  beforeEach(() => {
    repository = new AdminRepository();
    services = new AdminServices();
    jest.clearAllMocks();
  });

  test('Verify Admin Credentials', async () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminPassword';
    const adminData = { email: adminEmail, password: adminPassword };

    jest.spyOn(repository, 'findByEmail').mockResolvedValue([adminData.email]);

    const token = await services.verifyAdminCredentials(
      adminEmail,
      adminPassword,
    );

    expect(repository.findByEmail).toHaveBeenCalledTimes(1);
    expect(TokenManipulator.generateToken).toHaveBeenCalledTimes(1);
    expect(token).toHaveProperty('token');
  });

  test('Verify Admin Credentials Error Admin not found', async () => {
    repository.findByEmail = jest.fn().mockResolvedValue([]);
    try {
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
      await services.verifyAdminCredentials(adminEmail, 'invalidPassword');
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({ error: 'Invalid password' });
    }
  });
});
