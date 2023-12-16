import db from '../../model/connection/connection';
import { BoletosI } from '../../utils/types';

export default class BankSlipDao {
  public static async findAll() {
    return await db('slips').select('*');
  }

  public static async add(slip: BoletosI, id: string) {
    return await db('slips').insert({ ...slip, id: id });
  }

  public static async findById(id: string) {
    return await db('slips').select('*').where({ id: id }).first();
  }

  public static async findAndCancel(id: string, status: string) {
    return await db('slips').where({ id: id }).update({ status: status });
  }

  public static async findAdnPay(
    id: string,
    status: string,
    payment_date: Date,
  ) {
    return await db('slips').where({ id: id }).update({
      status: status,
      payment_date: payment_date,
    });
  }
}
