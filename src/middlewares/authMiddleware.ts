import HttpStatusCode from '../utils/enum/httpStatusCode';
import TokenManipulator from '../utils/tokenManipulator';
import { Request, Response, NextFunction } from 'express';

export default class AuthMiddleware {
  public static routeFilter(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Response {
    const { authorization }: any = request.headers;

    if (authorization === undefined) {
      return response
        .status(HttpStatusCode.NOT_FOUND)
        .send({ error: 'Token not found' });
    } else {
      const token = authorization.split(' ')[1];
      return TokenManipulator.validateToken(token)
        ? next()
        : response
            .status(HttpStatusCode.BAD_REQUEST)
            .send({ error: 'Invalid token' });
    }
  }
}
