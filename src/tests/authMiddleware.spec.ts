import AuthMiddleware from '../middlewares/authMiddleware';
import TokenManipulator from '../utils/tokenManipulator';

jest.mock('../utils/tokenManipulator', () => ({
  validateToken: jest.fn(),
}));

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Valid Token', () => {
    const request: any = { headers: { authorization: 'Bearer validToken' } };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const nextFunction: any = jest.fn();

    (TokenManipulator.validateToken as jest.Mock).mockReturnValue(true);

    AuthMiddleware.routeFilter(request, response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
  });

  test('Token not found Error', () => {
    const request: any = { headers: { authorization: undefined } };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const nextFunction: any = jest.fn();

    AuthMiddleware.routeFilter(request, response, nextFunction);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({ error: 'Token not found' });
  });

  test('Invalid Token Error', () => {
    const request: any = { headers: { authorization: 'InvalidToken' } };

    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const nextFunction: any = jest.fn();

    (TokenManipulator.validateToken as jest.Mock).mockReturnValue(false);

    AuthMiddleware.routeFilter(request, response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});
