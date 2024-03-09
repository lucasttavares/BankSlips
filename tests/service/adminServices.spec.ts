import AdminRepository from '../../src/database/AdminRepository';
import AdminServices from '../../src/services/adminServices';
import TokenManipulator from '../../src/utils/tokenManipulator';

jest.mock('../model/dao/adminDao');
jest.mock('../utils/tokenManipulator');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Verify Admin Credentials', async () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminPassword';
    const adminData = { email: adminEmail, password: adminPassword };

    AdminRepository.findByEmail = jest.fn().mockResolvedValue([adminData]);

    const token = await AdminServices.verifyAdminCredentials(
      adminEmail,
      adminPassword,
    );
    expect(AdminRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(TokenManipulator.generateToken).toHaveBeenCalledTimes(1);
    expect(token).toHaveProperty('token');
  });

  test('Verify Admin Credentials Error Admin not found', async () => {
    AdminRepository.findByEmail = jest.fn().mockResolvedValue([]);
    try {
      await AdminServices.verifyAdminCredentials('test@test.com', 'test');
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({ error: 'Admin not found' });
    }
  });

  test('Verify Admin Credentials Error Invalid password', async () => {
    const adminEmail = 'admin@example.com';
    AdminRepository.findByEmail = jest
      .fn()
      .mockResolvedValue([{ email: adminEmail, password: 'correctPassword' }]);

    try {
      await AdminServices.verifyAdminCredentials(adminEmail, 'invalidPassword');
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({ error: 'Invalid password' });
    }
  });
});
