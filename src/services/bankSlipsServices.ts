import BankSlipDao from '../model/dao/bankSlipDao';
import { v4 as uuidv4 } from 'uuid';
import { BoletosI } from '../utils/types';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BanckSlipsServices {
  public static async save(slip: BoletosI) {
    try {
      if (Object.keys(slip).length !== 0) {
        if (
          slip.total_in_cents !== null &&
          slip.due_date !== null &&
          slip.customer !== null &&
          typeof slip.total_in_cents === 'number' &&
          typeof slip.due_date === 'string' &&
          typeof slip.customer === 'string'
        ) {
          const uuid = uuidv4();

          await BankSlipDao.add(slip, uuid);
          return await BankSlipDao.findById(uuid);
        } else {
          throw {
            status: HttpStatusCode.UNPROCESSABLE_ENTITY,
            message: `<p>Invalid bankslip provided. The possible reasons are: <br/>
          • A field of the provided bankslip was null or with invalid values</p>`,
          };
        }
      } else {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Bankslip not provided in the request body',
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public static async pay(id: string, slip: BoletosI) {
    try {
      const paydedSlip = await BankSlipDao.findAdnPay(
        id,
        'PAID',
        slip.payment_date,
      );
      if (paydedSlip > 0) {
        return true;
      } else {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: 'Bankslip not found with the specified id',
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public static async cancel(id: string) {
    try {
      const canceledSlip = await BankSlipDao.findAndCancel(id, 'CANCELED');
      if (canceledSlip > 0) {
        return 'Bankslip canceled';
      } else {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Bankslip not found with the specified id',
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
