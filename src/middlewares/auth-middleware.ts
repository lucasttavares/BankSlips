import { validateToken } from '../utils/token-manipulator';
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { authorization }: any = request.headers;
  const token = authorization.split(' ')[1];

  return validateToken(token)
    ? next()
    : response.status(400).send({ error: 'Token inválido' });
}
