import { Request, Response } from 'express';
import HttpStatusCode from '../utils/enum/httpStatusCode';
import AdminRepository from '../database/AdminRepository';
import AdminServices from '../services/adminServices';
import TokenManipulator from '../utils/tokenManipulator';
import { base64ToString } from '../utils/base64ToString';

export default class AuthController {
  public static async register(request: Request, response: Response) {
    const admin = request.body;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await AdminRepository.add(admin));
    } catch (error) {
      return response.status(HttpStatusCode.BAD_REQUEST).send(error);
    }
  }

  public static async singIn(request: Request, response: Response) {
    const admin = request.body;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(
          await AdminServices.verifyAdminCredentials(
            admin.email,
            admin.password,
          ),
        );
    } catch (error: any) {
      return response.status(error.status).send(error.message);
    }
  }

  public static async refreshToken(request: Request, response: Response) {
    const { authorization } = request.headers;
    const admin = JSON.parse(base64ToString(authorization!.split('.')[1]));

    try {
      return response
        .status(HttpStatusCode.OK)
        .send({ token: TokenManipulator.generateToken(admin.user) });
    } catch (error) {
      return response.status(HttpStatusCode.BAD_REQUEST).send(error);
    }
  }
}
