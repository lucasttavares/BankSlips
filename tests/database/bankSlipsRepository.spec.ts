import BankSlipsRepository from '../../src/database/BankSlipsRepository';
import db from '../../src/infra/connection';

let repository: BankSlipsRepository;

jest.mock('../../src/infra/connection', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  }),
}));

describe('BankSlipsRepository', () => {
  beforeEach(() => {
    repository = new BankSlipsRepository();
    jest.clearAllMocks();
  });

  test('findAll', async () => {
    jest.spyOn(db(), 'select').mockResolvedValue([
      {
        id: '123',
        due_date: new Date('2024-01-10'),
        total_in_cents: 100,
        customer: 'A',
        status: 'PENDING',
        payment_date: null,
      },
    ]);

    const result = await repository.findAll();

    expect(result).toEqual([
      {
        id: '123',
        due_date: new Date('2024-01-10'),
        total_in_cents: 100,
        customer: 'A',
        status: 'PENDING',
        payment_date: null,
      },
    ]);
    expect(db().select).toHaveBeenCalledWith('*');
    expect(db().select).toHaveBeenCalledTimes(1);
  });

  test('add', async () => {
    const slip: any = {
      total_in_cents: 100,
      due_date: new Date('2024-01-10'),
      customer: 'A',
      status: 'PENDING',
      payment_date: null,
    };
    const id = '123';

    await repository.add(slip, id);

    expect(db().insert).toHaveBeenCalledWith({ ...slip, id });
    expect(db().insert).toHaveBeenCalledTimes(1);
  });

  test('findById', async () => {
    const id = '123';
    const slip = {
      id: '123',
      due_date: new Date('2024-01-10'),
      total_in_cents: 100,
      customer: 'A',
      status: 'PENDING',
      payment_date: null,
    };

    jest.spyOn(db(), 'select').mockReturnThis();
    jest.spyOn(db(), 'where').mockReturnThis();
    jest.spyOn(db(), 'first').mockResolvedValue(slip);

    const result = await repository.findById(id);

    expect(result).toEqual(slip);
    expect(db().select).toHaveBeenCalledWith('*');
    expect(db().where).toHaveBeenCalledWith({ id });
    expect(db().first).toHaveBeenCalledTimes(1);
  });

  test('updateStatus', async () => {
    const id = '123';
    const status = 'PAID';

    await repository.updateStatus(id, status);

    expect(db().where).toHaveBeenCalledWith({ id });
    expect(db().update).toHaveBeenCalledWith({ status });
    expect(db().update).toHaveBeenCalledTimes(1);
  });

  test('pay', async () => {
    const id = '123';
    const status = 'PAID';
    const payment_date = new Date('2024-04-22');

    await repository.pay(id, status, payment_date);

    expect(db().where).toHaveBeenCalledWith({ id });
    expect(db().update).toHaveBeenCalledWith({ status, payment_date });
    expect(db().update).toHaveBeenCalledTimes(1);
  });
});
