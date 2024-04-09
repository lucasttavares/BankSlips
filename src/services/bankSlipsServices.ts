import { v4 as uuidv4 } from 'uuid';
import BankSlipsRepository from '../database/BankSlipsRepository';
import BankSlips from '../model/BankSlips';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipsServices {
  private repository: BankSlipsRepository;

  constructor() {
    this.repository = new BankSlipsRepository();
  }

  public calculate(slip: any, insertedDate: number, dueDate: number) {
    const epochValue = 86400000;
    const countDays = (insertedDate - dueDate) / epochValue;
    let fine = 0;

    if (insertedDate <= dueDate) {
      return fine;
    }

    const fineRate =
      insertedDate <= dueDate + 10 * epochValue ? 0.5 / 100 : 1 / 100;
    fine = slip.total_in_cents * countDays * fineRate;

    return parseFloat(fine.toFixed(2));
  }

  public async fineCalculator(id: string) {
    try {
      const slip = await this.repository.findById(id);

      if (!slip) {
        throw new Error(`Bankslip not found with the specified id: ${id}`);
      }

      const currentDate = new Date().getTime();
      const paymentDate = slip.payment_date
        ? new Date(slip.payment_date).getTime()
        : 0;
      const dueDate = new Date(slip.due_date).getTime();

      let fineDate = currentDate;

      if (slip.status === 'PAID') {
        fineDate = paymentDate;
      }

      const fine = this.calculate(slip, fineDate, dueDate);

      return { ...slip, fine: fine };
    } catch (err) {
      throw new Error(
        `Failed to calculate fine for slip with id ${id}: ${
          (err as Error).message
        }`,
      );
    }
  }

  public async save(slip: BankSlips) {
    try {
      if (!slip || Object.keys(slip).length === 0) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: { error: 'Bankslip not provided in the request body' },
        };
      }

      const { total_in_cents, due_date, customer } = slip;

      if (
        !total_in_cents ||
        !due_date ||
        !customer ||
        typeof total_in_cents !== 'number' ||
        typeof due_date !== 'string' ||
        typeof customer !== 'string'
      ) {
        throw {
          status: HttpStatusCode.UNPROCESSABLE_ENTITY,
          message: {
            error:
              'Invalid bankslip provided. The possible reasons are: A field of the provided bankslip was null or with invalid values',
          },
        };
      }

      /*       if (!slip.due_date) {
        throw new Error('Due date is missing in the slip object.');
      } */

      const uuid = uuidv4();
      await this.repository.add(slip, uuid);
      return await this.repository.findById(uuid);
    } catch (err) {
      throw err;
    }
  }

  public async pay(id: string, slip: BankSlips) {
    try {
      const { payment_date } = slip;
      await this.repository.pay(id, 'PAID', payment_date);
    } catch (err) {
      throw {
        status: HttpStatusCode.NOT_FOUND,
        message: { error: 'Bankslip not found with the specified id' },
      };
    }
  }

  public async cancel(id: string) {
    try {
      await this.repository.updateStatus(id, 'CANCELED');
    } catch (err) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: { error: 'Bankslip not found with the specified id' },
      };
    }
  }

  public async findAll() {
    try {
      const slips = await this.repository.findAll();
      return slips;
    } catch (err) {
      throw new Error(`Failed to fetch all slips: ${(err as Error).message}`);
    }
  }
}
