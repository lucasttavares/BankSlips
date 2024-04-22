import AuthController from '../../src/controllers/AuthController';
import AdminRepository from '../../src/database/AdminRepository';
import AdminServices from '../../src/services/AdminServices';
import TokenManipulator from '../../src/utils/tokenManipulator';

let repository: AdminRepository;
let services: AdminServices;

jest.mock('../../src/database/AdminRepository', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/services/AdminServices', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    verifyAdminCredentials: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/utils/tokenManipulator');

describe('Auth Controller', () => {
  beforeEach(() => {
    repository = new AdminRepository();
    services = new AdminServices();
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

    const authController = new AuthController();
    jest.spyOn(repository, 'add').mockResolvedValue(request);

    await authController.register(request, response);

    expect(repository.add).toHaveBeenCalledTimes(1);
    expect(repository.add).toHaveBeenCalledWith({
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
      const authController = new AuthController();
      await authController.register(request, response);
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

    const authController = new AuthController();
    jest.spyOn(services, 'verifyAdminCredentials').mockResolvedValue(request);

    await authController.singIn(request, response);

    expect(services.verifyAdminCredentials).toHaveBeenCalledTimes(1);
    expect(services.verifyAdminCredentials).toHaveBeenCalledWith(
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
      const adminServices = new AdminServices();
      await adminServices.verifyAdminCredentials(admin.email, admin.password);
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
      const adminServices = new AdminServices();
      await adminServices.verifyAdminCredentials(admin.email, admin.password);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({ error: 'Invalid password' });
    }
  });

  test('Refresh Token', async () => {
    const request: any = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const authController = new AuthController();

    TokenManipulator.generateToken = jest.fn().mockReturnValue('newToken');
    await authController.refreshToken(request, response);

    expect(TokenManipulator.generateToken).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith({ token: 'newToken' });
  });
});
