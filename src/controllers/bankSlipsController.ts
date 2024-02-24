import { Request, Response } from 'express';
import BankSlipsDao from '../model/dao/bankSlipsDao';
import FineCalculatorServices from '../services/fineCaulculatorServices';
import BankSlipsServices from '../services/bankSlipsServices';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipController {
  public static async postSlip(request: Request, response: Response) {
    const slip = request.body;
    try {
      return response
        .status(HttpStatusCode.CREATED)
        .send(await BankSlipsServices.save(slip));
    } catch (err: any) {
      return response.status(err.status).send({ error: err.message });
    }
  }

  public static async getSlips(request: Request, response: Response) {
    return response
      .status(HttpStatusCode.OK)
      .send(await BankSlipsDao.findAll());
  }

  public static async getSlipsById(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await FineCalculatorServices.fineCalculator(id));
    } catch (err) {
      return response
        .status(HttpStatusCode.NOT_FOUND)
        .send('Bankslip not found with the specified id');
    }
  }

  public static async paySlip(request: Request, response: Response) {
    const id = request.params.id;
    const slip = request.body;

    try {
      BankSlipsServices.pay(id, slip);
      return response.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }

  public static async cancelSlip(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await BankSlipsServices.cancel(id));
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }
}
