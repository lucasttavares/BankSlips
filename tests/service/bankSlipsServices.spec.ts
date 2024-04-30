import { v4 as uuidv4 } from 'uuid';
import BankSlipsRepository from '../../src/database/BankSlipsRepository';
import BankSlipsServices from '../../src/services/BankSlipsServices';

let repository: BankSlipsRepository;

jest.mock('../../src/database/BankSlipsRepository', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    pay: jest.fn().mockReturnThis(),
    updateStatus: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('BankSlips Services', () => {
  beforeEach(() => {
    repository = new BankSlipsRepository();
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

    const service = new BankSlipsServices();
    await service.save(slip);

    expect(repository.add).toHaveBeenCalledTimes(1);
    expect(repository.add).toHaveBeenCalledWith(slip, id);
    expect(repository.findById).toHaveBeenCalledWith(id);
  });

  test('BankSlips Services Error empty data', async () => {
    const slip: any = {};

    try {
      const service = new BankSlipsServices();
      await service.save(slip);
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
      const service = new BankSlipsServices();
      await service.save(slip);
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

    const service = new BankSlipsServices();
    await service.pay(id, slip);

    expect(repository.pay).toHaveBeenCalledTimes(1);
    expect(repository.pay).toHaveBeenCalledWith(id, 'PAID', slip.payment_date);
  });

  test('Pay Slip Error not found', async () => {
    const id = '';
    const slip: any = {};

    const service = new BankSlipsServices();

    try {
      await service.pay(id, slip);
    } catch (error: any) {
      expect(error.status).toBe(404);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });

  test('Cancel Slip', async () => {
    const id = '7954f4b0-7ce9-424e-93fd-83c71eea3bc7';

    const service = new BankSlipsServices();
    await service.cancel(id);

    expect(repository.updateStatus).toHaveBeenCalledTimes(1);
    expect(repository.updateStatus).toHaveBeenCalledWith(id, 'CANCELED');
  });

  test('Cancel Slip Error not found', async () => {
    const id = '';

    const service = new BankSlipsServices();
    await service.cancel(id);

    try {
      await service.cancel(id);
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.message).toEqual({
        error: 'Bankslip not found with the specified id',
      });
    }
  });
});
