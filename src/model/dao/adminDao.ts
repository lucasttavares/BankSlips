import db from '../connection/connection';

export default class AdminDao {
  public email: string;
  public user: string;
  public password: string;

  public static async add(admin: AdminDao) {
    return await db('admin').insert(admin);
  }

  public static async findByEmail(email: string) {
    return await db('admin').select('*').where({ email: email });
  }
}
