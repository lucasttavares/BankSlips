import AuthController from '../controllers/authController';
import AdminDao from '../model/dao/adminDao';
import AdminServices from '../services/adminServices';

jest.mock('../model/dao/adminDao');
jest.mock('../services/adminServices');
jest.mock('../utils/tokenManipulator');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Register Admin', async () => {
    const request: any = {
      body: {
        email: 'admin@admin.com',
        user: 'admin',
        password: '123',
      },
    };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await AuthController.register(request, response);

    expect(AdminDao.add).toHaveBeenCalledTimes(1);
    expect(AdminDao.add).toHaveBeenCalledWith({
      email: 'admin@admin.com',
      user: 'admin',
      password: '123',
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Register Admin Error 400', async () => {
    const request: any = {
      body: {},
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    try {
      await AuthController.register(request, response);
    } catch (error) {
      expect(response.status).toHaveBeenCalledWith(400);
    }
  });

  test('SingIn Admin', async () => {
    const request: any = {
      body: {
        email: 'admin@admin.com',
        password: '123',
      },
    };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await AuthController.singIn(request, response);

    expect(AdminServices.verifyAdminCredentials).toHaveBeenCalledTimes(1);
    expect(AdminServices.verifyAdminCredentials).toHaveBeenCalledWith(
      'admin@admin.com',
      '123',
    );
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('SingIn Admin Error 404', async () => {
    const admin: any = {
      email: '',
      password: '123',
    };

    try {
      await AdminServices.verifyAdminCredentials(admin.email, admin.password);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({ error: 'Admin not found' });
    }
  });

  test('SingIn Admin Error 400', async () => {
    const admin: any = {
      email: 'admin@admin.com',
      password: '1234',
    };

    try {
      await AdminServices.verifyAdminCredentials(admin.email, admin.password);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({ error: 'Invalid password' });
    }
  });
});
