import db from '../infra/connection';

export default class AdminRepository {
  public email: string;
  public user: string;
  public password: string;

  public static async add(admin: AdminRepository) {
    return await db('admin').insert(admin);
  }

  public static async findByEmail(email: string) {
    return await db('admin').select('*').where({ email: email });
  }
}
