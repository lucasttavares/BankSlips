import { Request, Response } from 'express';
import BankSlipDao from '../model/dao/bankSlipDao';
import FineCalculatorService from '../services/fineCaulculator';
import BanckSlipsServices from '../services/bankSlipsServices';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipController {
  public static async postSlip(request: Request, response: Response) {
    const slip = request.body;
    try {
      return response
        .status(HttpStatusCode.CREATED)
        .send(await BanckSlipsServices.save(slip));
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }

  public static async getSlips(request: Request, response: Response) {
    return response.status(HttpStatusCode.OK).send(await BankSlipDao.findAll());
  }

  public static async getSlipsById(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await FineCalculatorService.fineCalculator(id));
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
      BanckSlipsServices.pay(id, slip);
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
        .send(await BanckSlipsServices.cancel(id));
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }
}
