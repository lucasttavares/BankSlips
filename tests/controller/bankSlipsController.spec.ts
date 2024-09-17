import BankSlipController from '../../src/controllers/BankSlipController';
import BankSlipsRepository from '../../src/database/BankSlipsRepository';
import BankSlipsServices from '../../src/services/BankSlipsServices';

let repository: BankSlipsRepository;
let services: BankSlipsServices;

jest.mock('../../src/database/BankSlipsRepository', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findAll: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('../../src/services/BankSlipsServices', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findAll: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    fineCalculator: jest.fn().mockReturnThis(),
    pay: jest.fn().mockReturnThis(),
    cancel: jest.fn().mockReturnThis(),
  }),
}));

describe('BankSlip Controller', () => {
  beforeEach(() => {
    repository = new BankSlipsRepository();
    services = new BankSlipsServices();
    jest.clearAllMocks();
  });

  test('POST Slip', async () => {
    const request: any = {
      body: {
        due_date: '2023-12-01',
        total_in_cents: 100,
        customer: 'test',
      },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const slipController = new BankSlipController();
    jest.spyOn(services, 'save').mockResolvedValue(request);

    await slipController.postSlip(request, response);

    expect(services.save).toHaveBeenCalledTimes(1);
    expect(services.save).toHaveBeenCalledWith({
      due_date: '2023-12-01',
      total_in_cents: 100,
      customer: 'test',
    });
    expect(response.status).toHaveBeenCalledWith(201);
  });

  test('POST Slip Error 400', async () => {
    const request: any = { body: {} };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    try {
      const slipController = new BankSlipController();
      await slipController.postSlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not provided in the request body',
      );
    }
  });

  test('POST Slip Error 422', async () => {
    const request: any = {
      body: {
        due_date: '2023-12-01',
        total_in_cents: null,
        customer: 'test',
      },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    try {
      const slipController = new BankSlipController();
      await slipController.postSlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(422);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not provided in the request body',
      );
    }
  });

  test('GET Slips', async () => {
    const request: any = {};
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const slipController = new BankSlipController();
    jest.spyOn(services, 'findAll').mockResolvedValue(request);

    await slipController.getSlips(request, response);

    expect(services.findAll).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('GET Slip By ID', async () => {
    const request: any = {
      params: { id: 'test' },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const slipController = new BankSlipController();
    jest.spyOn(services, 'fineCalculator').mockResolvedValue(request);

    await slipController.getSlipsById(request, response);

    expect(services.fineCalculator).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('GET Slip By ID Error 404', async () => {
    const request: any = {
      params: {},
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    try {
      const slipController = new BankSlipController();
      await slipController.getSlipsById(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not found with the specified id',
      );
    }
  });

  test('Pay Slip', async () => {
    const request: any = {
      params: { id: 'test' },
      body: { payment_date: '2023-12-01' },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const slipController = new BankSlipController();
    jest.spyOn(services, 'pay').mockResolvedValue(request);

    await slipController.paySlip(request, response);

    expect(services.pay).toHaveBeenCalledTimes(1);
    expect(services.pay).toHaveBeenCalledWith('test', {
      payment_date: '2023-12-01',
    });
    expect(response.status).toHaveBeenCalledWith(204);
  });

  test('Pay Slip Error 404', async () => {
    const request: any = {
      params: {},
      body: { payment_date: '2023-12-01' },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    try {
      const slipController = new BankSlipController();
      await slipController.paySlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not found with the specified id',
      );
    }
  });

  test('Cancel Slip', async () => {
    const request: any = {
      params: { id: 'test' },
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const slipController = new BankSlipController();
    jest.spyOn(services, 'findAll').mockResolvedValue(request);

    await slipController.cancelSlip(request, response);

    expect(services.cancel).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(204);
  });

  test('Pay Slip Error 404', async () => {
    const request: any = {
      params: {},
    };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    try {
      const slipController = new BankSlipController();
      await slipController.cancelSlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not found with the specified id',
      );
    }
  });
});
