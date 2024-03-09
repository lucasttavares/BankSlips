import HttpStatusCode from '../utils/enum/httpStatusCode';
import AdminRepository from '../database/AdminRepository';
import TokenManipulator from '../utils/tokenManipulator';

export default class AdminServices {
  public static async verifyAdminCredentials(email: string, password: string) {
    const admin: AdminRepository[] = await AdminRepository.findByEmail(email);
    if (admin.length === 0) {
      throw {
        status: HttpStatusCode.NOT_FOUND,
        message: { error: 'Admin not found' },
      };
    }
    if (password !== admin[0].password) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: { error: 'Invalid password' },
      };
    }

    return { token: TokenManipulator.generateToken(admin[0].email) };
  }
}
