import BankSlipsDao from '../model/dao/bankSlipsDao';
import { v4 as uuidv4 } from 'uuid';
import HttpStatusCode from '../utils/enum/httpStatusCode';
import AdminDao from '../model/dao/adminDao';
import TokenManipulator from '../utils/tokenManipulator';

export default class BankSlipsServices {
  public static async save(slip: BankSlipsDao) {
    try {
      if (Object.keys(slip).length === 0) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: { error: 'Bankslip not provided in the request body' },
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
          message: {
            error:
              'Invalid bankslip provided. The possible reasons are: A field of the provided bankslip was null or with invalid values',
          },
        };
      }

      const uuid = uuidv4();
      await BankSlipsDao.add(slip, uuid);
      return await BankSlipsDao.findById(uuid);
    } catch (err) {
      throw err;
    }
  }

  public static async pay(id: string, slip: BankSlipsDao) {
    try {
      const paydedSlip = await BankSlipsDao.findAndPay(
        id,
        'PAID',
        slip.payment_date,
      );
      if (paydedSlip === 0) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: { error: 'Bankslip not found with the specified id' },
        };
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  public static async cancel(id: string) {
    try {
      const canceledSlip = await BankSlipsDao.findAndCancel(id, 'CANCELED');

      if (canceledSlip === 0) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: { error: 'Bankslip not found with the specified id' },
        };
      }
      return { message: 'Bankslip canceled' };
    } catch (err) {
      throw err;
    }
  }
}
