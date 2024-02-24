import { Request, Response } from 'express';
import HttpStatusCode from '../utils/enum/httpStatusCode';
import AdminDao from '../model/dao/adminDao';
import AdminServices from '../services/adminServices';

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
}
