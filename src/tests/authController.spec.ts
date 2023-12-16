import authcontroller from '../controllers/authController';
import TokenManipulator from '../utils/tokenManipulator';

jest.mock('../utils/tokenManipulator');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('POST AuthUser', () => {
    const request: any = {
      body: {
        user: 'test',
      },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authcontroller.singIn(request, response);

    expect(TokenManipulator.generateToken).toHaveBeenCalledTimes(1);
    expect(TokenManipulator.generateToken).toHaveBeenCalledWith('test');
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('POST AuthUser Error', () => {
    const request: any = {
      body: {
        user: '',
      },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authcontroller.singIn(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith('Failed to generate token');
  });
});
