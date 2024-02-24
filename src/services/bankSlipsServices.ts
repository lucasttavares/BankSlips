import BankSlipDao from '../model/dao/bankSlipDao';
import { v4 as uuidv4 } from 'uuid';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipsServices {
  public static async save(slip: BankSlipDao) {
    try {
      if (Object.keys(slip).length === 0) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Bankslip not provided in the request body',
        };
      }

      if (
        slip.total_in_cents === null ||
        slip.due_date === null ||
        slip.customer === null ||
        typeof slip.total_in_cents !== 'number' ||
        typeof slip.due_date !== 'string' ||
        typeof slip.customer !== 'string'
      ) {
        throw {
          status: HttpStatusCode.UNPROCESSABLE_ENTITY,
          message:
            'Invalid bankslip provided. The possible reasons are: A field of the provided bankslip was null or with invalid values',
        };
      }

      const uuid = uuidv4();

      await BankSlipDao.add(slip, uuid);
      return await BankSlipDao.findById(uuid);
    } catch (err) {
      throw err;
    }
  }

  public static async pay(id: string, slip: BankSlipDao) {
    try {
      const paydedSlip = await BankSlipDao.findAndPay(
        id,
        'PAID',
        slip.payment_date,
      );
      if (paydedSlip === 0) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: 'Bankslip not found with the specified id',
        };
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  public static async cancel(id: string) {
    try {
      const canceledSlip = await BankSlipDao.findAndCancel(id, 'CANCELED');

      if (canceledSlip === 0) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Bankslip not found with the specified id',
        };
      }
      return 'Bankslip canceled';
    } catch (err) {
      throw err;
    }
  }
}
