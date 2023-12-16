import { Request, Response } from 'express';
import TokenManipulator from '../utils/tokenManipulator';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class AuthController {
  public static singIn(request: Request, response: Response) {
    const { user } = request.body;
    if (user !== '') {
      return response
        .status(200)
        .send({ token: `Bearer ${TokenManipulator.generateToken(user)}` });
    } else {
      return response
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send('Failed to generate token');
    }
  }
}
