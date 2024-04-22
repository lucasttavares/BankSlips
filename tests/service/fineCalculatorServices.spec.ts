import BankSlipsServices from '../../src/services/BankSlipsServices';

describe('Fine Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Calcucale fine within first 10 days', async () => {
    const slip: any = {
      total_in_cents: 100,
    };

    const slipService = new BankSlipsServices();
    const insertedDate = new Date('2024-02-05').getTime();
    const dueDate = new Date('2024-02-01').getTime();
    const epochValue = 86400000;
    const countDays = (insertedDate - dueDate) / epochValue;

    const fine = slipService.calculate(slip, insertedDate, dueDate);

    const expectFine = slip.total_in_cents * countDays * (0.5 / 100);

    expect(fine).toBe(expectFine);
  });

  test('Calcucale fine outside 10 days', async () => {
    const slip: any = {
      total_in_cents: 100,
    };

    const slipService = new BankSlipsServices();
    const insertedDate = new Date('2024-02-12').getTime();
    const dueDate = new Date('2024-02-01').getTime();
    const epochValue = 86400000;
    const countDays = (insertedDate - dueDate) / epochValue;

    const fine = slipService.calculate(slip, insertedDate, dueDate);

    const expectFine = slip.total_in_cents * countDays * (1 / 100);

    expect(fine).toBe(expectFine);
  });

  test('Calculate no fine', async () => {
    const slip: any = {
      total_in_cents: 100,
    };

    const slipService = new BankSlipsServices();
    const insertedDate = new Date('2024-02-01').getTime();
    const dueDate = new Date('2024-02-01').getTime();

    const fine = slipService.calculate(slip, insertedDate, dueDate);

    expect(fine).toBe(0);
  });

  /* test('Fine Calculate with slip status Pending', async () => {
    const slip: any = {
      id: 'test',
      status: 'PENDING',
      due_date: '2024-02-01',
      total_in_cents: 100,
    };

    const slipService = new BankSlipsServices();
    const repository = new BankSlipsRepository();

    jest.spyOn(repository, 'findById').mockResolvedValue(slip);

    const currentDate = new Date().getTime();
    const dueDate = new Date(slip.due_date).getTime();
    const fine = slipService.calculate(slip, currentDate, dueDate);

    const result = await slipService.fineCalculator(slip.id);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(slip.id);
    expect(result).toEqual({ ...slip, fine: fine });
  });

  test('Fine Calculate with slip status Paid', async () => {
    const slip: any = {
      id: '7954f4b0-7ce9-424e-93fd-83c71eea3bc7',
      status: 'PAID',
      payment_date: '2024-02-05',
      due_date: '2024-02-01',
    };

    const repository = new BankSlipsRepository();
    jest.spyOn(repository, 'findById').mockResolvedValue(slip);

    const slipService = new BankSlipsServices();
    const paymentDate = new Date(slip.payment_date).getTime();
    const dueDate = new Date(slip.due_date).getTime();
    const fine = slipService.calculate(slip, paymentDate, dueDate);

    const result = await slipService.fineCalculator(slip.id);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(slip.id);
    expect(result).toEqual({ ...slip, fine: fine });
  });

  test('Fine Calculate with slip status Canceled', async () => {
    const slip: any = {
      id: '7954f4b0-7ce9-424e-93fd-83c71eea3bc7',
      status: 'CANCELED',
      due_date: '2024-02-01',
    };

    const repository = new BankSlipsRepository();
    jest.spyOn(repository, 'findById').mockResolvedValueOnce(slip);

    const slipService = new BankSlipsServices();
    const result = await slipService.fineCalculator(slip.id);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(slip.id);
    expect(result).toEqual(slip);
  }); */
});
