import TokenManipulator from '../utils/functions/tokenManipulator';
import { Request, Response, NextFunction } from 'express';

export default class AuthMiddleware {
  public static routeFilter(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Response {
    const { authorization }: any = request.headers;

    if (authorization === undefined) {
      return response.status(404).send({ error: 'Token not found' });
    } else {
      const token = authorization.split(' ')[1];
      return TokenManipulator.validateToken(token)
        ? next()
        : response.status(400).send({ error: 'Invalid token' });
    }
  }
}
