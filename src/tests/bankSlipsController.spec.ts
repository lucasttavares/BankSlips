import BankSlipController from '../controllers/bankSlipsController';
import BankSlipsDao from '../model/dao/bankSlipsDao';
import BankSlipsServices from '../services/bankSlipsServices';
import FineCalculatorServices from '../services/fineCaulculatorServices';

jest.mock('../model/dao/bankSlipsDao');
jest.mock('../services/bankSlipsServices');
jest.mock('../services/fineCaulculatorServices');

describe('BankSlip Controller', () => {
  beforeEach(() => {
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
    await BankSlipController.postSlip(request, response);

    expect(BankSlipsServices.save).toHaveBeenCalledTimes(1);
    expect(BankSlipsServices.save).toHaveBeenCalledWith({
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
      await BankSlipController.postSlip(request, response);
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
      await BankSlipController.postSlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(422);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not provided in the request body',
      );
    }
  });

  test('GET Slip', async () => {
    const request: any = {};
    const response: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await BankSlipController.getSlips(request, response);

    expect(BankSlipsDao.findAll).toHaveBeenCalledTimes(1);
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
    await BankSlipController.getSlipsById(request, response);

    expect(FineCalculatorServices.fineCalculator).toHaveBeenCalledTimes(1);
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
      await BankSlipController.getSlipsById(request, response);
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
    await BankSlipController.paySlip(request, response);

    expect(BankSlipsServices.pay).toHaveBeenCalledTimes(1);
    expect(BankSlipsServices.pay).toHaveBeenCalledWith('test', {
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
      await BankSlipController.paySlip(request, response);
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

    await BankSlipController.cancelSlip(request, response);

    expect(BankSlipsServices.cancel).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
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
      await BankSlipController.cancelSlip(request, response);
    } catch (err) {
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith(
        'Bankslip not found with the specified id',
      );
    }
  });
});
