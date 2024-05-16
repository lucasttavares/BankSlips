import { Request, Response } from 'express';
import BankSlipsServices from '../services/BankSlipsServices';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipController {
  private bankSlipsServices: BankSlipsServices;

  constructor() {
    this.bankSlipsServices = new BankSlipsServices();
  }

  public async postSlip(request: Request, response: Response) {
    const slip = request.body;
    try {
      const saved = await this.bankSlipsServices.save(slip);
      return response.status(HttpStatusCode.CREATED).send(saved);
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }

  public getSlips = async (request: Request, response: Response) => {
    return response
      .status(HttpStatusCode.OK)
      .send(await this.bankSlipsServices.findAll());
  };

  public async getSlipsById(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await this.bankSlipsServices.fineCalculator(id));
    } catch (err: any) {
      return response.status(HttpStatusCode.NOT_FOUND).send(err.message);
    }
  }

  public async paySlip(request: Request, response: Response) {
    const id = request.params.id;
    const slip = request.body;

    try {
      await this.bankSlipsServices.pay(id, slip);
      return response.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }

  public async cancelSlip(request: Request, response: Response) {
    const id = request.params.id;
    try {
      await this.bankSlipsServices.cancel(id);
      return response.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }
}
