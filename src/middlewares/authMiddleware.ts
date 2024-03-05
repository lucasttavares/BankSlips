import HttpStatusCode from '../utils/enum/httpStatusCode';
import TokenManipulator from '../utils/tokenManipulator';
import { Request, Response, NextFunction } from 'express';

export default class AuthMiddleware {
  public static routeFilter(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Response {
    const { authorization } = request.headers;

    if (!authorization) {
      return response
        .status(HttpStatusCode.NOT_FOUND)
        .send({ error: 'Token not found' });
    }

    const token = authorization.split(' ')[1];

    if (TokenManipulator.validateToken(token)) {
      return next();
    }

    return response
      .status(HttpStatusCode.BAD_REQUEST)
      .send({ error: 'Invalid token' });
  }
}
