import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class TokenManipulator {
  public static generateToken(user: string): string {
    return jwt.sign({ user }, `${process.env.TOKEN_KEY}`, { expiresIn: 10800 });
  }

  public static validateToken(token: string): boolean {
    let validate = true;
    jwt.verify(token, `${process.env.TOKEN_KEY}`, error => {
      if (error) {
        validate = false;
      }
    });
    return validate;
  }
}
