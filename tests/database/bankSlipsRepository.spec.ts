import BankSlipsRepository from '../../src/database/BankSlipsRepository';
import db from '../../src/infra/connection';

let repository: BankSlipsRepository;

jest.mock('../src/infra/connection', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis()
  }),
}));

describe('BankSlipsRepository', () => {
  beforeEach(() => {
    repository = new BankSlipsRepository();
    jest.clearAllMocks();

  });

  it('findAll returns all slips', async () => {
    jest.spyOn(db(), 'select').mockResolvedValue([{ id: '123', total_in_cents: 1000 }]);

    const result = await repository.findAll();

    expect(result).toEqual([{ id: '123', total_in_cents: 1000 }]);
    expect(db().select).toHaveBeenCalledWith('*');
    expect(db().select).toHaveBeenCalledTimes(1);
  });
});

