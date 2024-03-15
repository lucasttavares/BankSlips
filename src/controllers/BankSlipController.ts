import { Request, Response } from 'express';
import BankSlipsServices from '../services/bankSlipsServices';
import HttpStatusCode from '../utils/enum/httpStatusCode';

export default class BankSlipController {
  private bankSlipsServices: BankSlipsServices;

  constructor() {
    this.bankSlipsServices = new BankSlipsServices();
  }

  public async postSlip(request: Request, response: Response) {
    const slip = request.body;
    try {
      return response
        .status(HttpStatusCode.CREATED)
        .send(await this.bankSlipsServices.save(slip));
    } catch (err: any) {
      return response.status(err.status).send({ error: err.message });
    }
  }

  public async getSlips(request: Request, response: Response) {
    return response
      .status(HttpStatusCode.OK)
      .send(await this.bankSlipsServices.findAll());
  }

  public async getSlipsById(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await this.bankSlipsServices.fineCalculator(id));
    } catch (err) {
      return response
        .status(HttpStatusCode.NOT_FOUND)
        .send('Bankslip not found with the specified id');
    }
  }

  public async paySlip(request: Request, response: Response) {
    const id = request.params.id;
    const slip = request.body;

    try {
      this.bankSlipsServices.pay(id, slip);
      return response.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }

  public async cancelSlip(request: Request, response: Response) {
    const id = request.params.id;
    try {
      return response
        .status(HttpStatusCode.OK)
        .send(await this.bankSlipsServices.cancel(id));
    } catch (err: any) {
      return response.status(err.status).send(err.message);
    }
  }
}
