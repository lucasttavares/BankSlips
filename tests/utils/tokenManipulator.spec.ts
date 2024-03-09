import TokenManipulator from '../../src/utils/tokenManipulator';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Token Manipulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Generate Token', () => {
    const user = 'user';
    const token = 'generatedToken';

    jest.spyOn(jwt, 'sign').mockImplementation(() => token);

    const generatedToken = TokenManipulator.generateToken(user);

    expect(jwt.sign).toHaveBeenCalledWith({ user }, process.env.TOKEN_KEY, {
      expiresIn: 10800,
    });
    expect(generatedToken).toBe(token);
  });

  test('Validate Token', () => {
    const validToken = jwt.sign(
      { email: 'admin@admin.com' },
      `${process.env.TOKEN_KEY}`,
      { expiresIn: 10800 },
    );

    (jwt.verify as jest.Mock).mockImplementation(
      (token, secretKey, callback) => {
        callback(null);
      },
    );

    const result = TokenManipulator.validateToken(validToken);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('Validate Token Error', () => {
    const invalidToken = 'invalidToken';

    (jwt.verify as jest.Mock).mockImplementation(
      (token, secretKey, callback) => {
        callback(new Error('Invalid Token'));
      },
    );

    const result = TokenManipulator.validateToken(invalidToken);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });
});
