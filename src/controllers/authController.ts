import { Request, Response } from 'express';
import TokenManipulator from '../utils/functions/tokenManipulator';

export default class AuthController {
  public static singIn(request: Request, response: Response) {
    const { user } = request.body;
    return response
      .status(200)
      .send({ token: `Bearer ${TokenManipulator.generateToken(user)}` });
  }
}
