import BankSlipsServices from '../services/bankSlipsServices';
import BankSlipsDao from '../model/dao/bankSlipsDao';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../model/dao/bankSlipsDao');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('BankSlips Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Save Slip', async () => {
    const slip: any = {
      due_date: '2018-01-01',
      total_in_cents: 10,
      customer: 'test',
    };

    const id = '7954f4b0-7ce9-424e-93fd-83c71eea3bc7';
    (uuidv4 as jest.Mock).mockReturnValueOnce(id);

    await BankSlipsServices.save(slip);

    expect(BankSlipsDao.add).toHaveBeenCalledTimes(1);
    expect(BankSlipsDao.add).toHaveBeenCalledWith(slip, id);
    expect(BankSlipsDao.findById).toHaveBeenCalledWith(id);
  });

  test('BankSlips Services Error empty data', async () => {
    const slip: any = {};

    try {
      await BankSlipsServices.save(slip);
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({
        error: 'Bankslip not provided in the request body',
      });
    }
  });

  test('BankSlips Services Error null or with invalid values', async () => {
    const slip: any = {
      due_date: null,
      total_in_cents: 10,
      customer: 'test',
    };

    try {
      await BankSlipsServices.save(slip);
    } catch (error: any) {
      expect(error.status).toBe(422);
      expect(error.message).toEqual({
        error:
          'Invalid bankslip provided. The possible reasons are: A field of the provided bankslip was null or with invalid values',
      });
    }
  });

  test('Pay Slip', async () => {
    const id = '7954f4b0-7ce9-424e-93fd-83c71eea3bc7';
    const slip: any = {
      payment_date: '2024-02-10',
    };

    const result = await BankSlipsServices.pay(id, slip);

    expect(BankSlipsDao.findAndPay).toHaveBeenCalledTimes(1);
    expect(BankSlipsDao.findAndPay).toHaveBeenCalledWith(
      id,
      'PAID',
      slip.payment_date,
    );
    expect(result).toBe(true);
  });

  test('Pay Slip Error not found', async () => {
    const id = '';
    const slip: any = {};

    (BankSlipsDao.findAndPay as jest.Mock).mockResolvedValueOnce(0);

    try {
      await BankSlipsServices.pay(id, slip);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });

  test('Cancel Slip', async () => {
    const id = '7954f4b0-7ce9-424e-93fd-83c71eea3bc7';
    const result = await BankSlipsServices.cancel(id);

    expect(BankSlipsDao.findAndCancel).toHaveBeenCalledTimes(1);
    expect(BankSlipsDao.findAndCancel).toHaveBeenCalledWith(id, 'CANCELED');
    expect(result).toEqual({ message: 'Bankslip canceled' });
  });

  test('Cancel Slip Error not found', async () => {
    const id = '';

    (BankSlipsDao.findAndCancel as jest.Mock).mockResolvedValueOnce(0);

    try {
      await BankSlipsServices.cancel(id);
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });
});
