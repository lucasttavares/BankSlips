import { Request, Response } from 'express';
import HttpStatusCode from '../utils/enum/httpStatusCode';
import AdminDao from '../model/dao/adminDao';
import AdminServices from '../services/adminServices';
import TokenManipulator from '../utils/tokenManipulator';

export default class AuthController {
  public static async register(request: Request, response: Response) {
    const admin = request.body;
    try {
      return response.status(HttpStatusCode.OK).send(await AdminDao.add(admin));
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
    const token = String(authorization);
    const admin = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    try {
      return response
        .status(HttpStatusCode.OK)
        .send({ token: TokenManipulator.generateToken(admin) });
    } catch (error) {
      return response.status(HttpStatusCode.BAD_REQUEST).send(error);
    }
  }
}
