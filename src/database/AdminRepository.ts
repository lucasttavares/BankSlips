import db from '../infra/connection';
import Admin from '../model/Admin';

export default class AdminRepository {
  private tableName = 'admin';

  public async add(admin: Admin): Promise<void> {
    return await db(this.tableName).insert(admin);
  }

  public async findByEmail(email: string) {
    return await db(this.tableName).select('*').where({ email: email });
  }
}
