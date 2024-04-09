import { v4 as uuidv4 } from 'uuid';
import BankSlipsRepository from '../../src/database/BankSlipsRepository';
import BankSlipsServices from '../../src/services/bankSlipsServices';

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

    const slipService = new BankSlipsServices();
    await slipService.save(slip);

    const repository = new BankSlipsRepository();

    expect(repository.add).toHaveBeenCalledTimes(1);
    expect(repository.add).toHaveBeenCalledWith(slip, id);
    expect(repository.findById).toHaveBeenCalledWith(id);
  });

  test('BankSlips Services Error empty data', async () => {
    const slip: any = {};

    try {
      const slipService = new BankSlipsServices();
      await slipService.save(slip);
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
      const slipService = new BankSlipsServices();
      await slipService.save(slip);
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

    const slipService = new BankSlipsServices();
    const result = await slipService.pay(id, slip);

    expect(slipService.pay).toHaveBeenCalledTimes(1);
    expect(slipService.pay).toHaveBeenCalledWith(id, 'PAID', slip.payment_date);
    expect(result).toBe(true);
  });

  test('Pay Slip Error not found', async () => {
    const id = '';
    const slip: any = {};

    const slipService = new BankSlipsServices();

    (slipService.pay as jest.Mock).mockResolvedValueOnce(0);

    try {
      await slipService.pay(id, slip);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });

  test('Cancel Slip', async () => {
    const id = '7954f4b0-7ce9-424e-93fd-83c71eea3bc7';

    const slipService = new BankSlipsServices();

    expect(slipService.cancel).toHaveBeenCalledTimes(1);
    expect(slipService.cancel).toHaveBeenCalledWith(id, 'CANCELED');
  });

  test('Cancel Slip Error not found', async () => {
    const id = '';

    const slipService = new BankSlipsServices();
    (slipService.cancel as jest.Mock).mockResolvedValueOnce(0);

    try {
      await slipService.cancel(id);
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });
});
