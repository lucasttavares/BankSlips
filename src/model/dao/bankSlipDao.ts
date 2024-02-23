import db from '../../model/connection/connection';

export default class BankSlipDao {
  public id: string;
  public due_date: Date;
  public total_in_cents: number;
  public customer: string;
  public status: string;
  public payment_date: Date;

  public static async findAll() {
    return await db('slips').select('*');
  }

  public static async add(slip: BankSlipDao, id: string) {
    return await db('slips').insert({ ...slip, id: id });
  }

  public static async findById(id: string) {
    return await db('slips').select('*').where({ id: id }).first();
  }

  public static async findAndCancel(id: string, status: string) {
    return await db('slips').where({ id: id }).update({ status: status });
  }

  public static async findAndPay(
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
