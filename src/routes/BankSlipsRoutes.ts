import express, { Router } from 'express';
import BankSlipsController from '../controllers/BankSlipController';
import AuthMiddleware from '../middlewares/authMiddleware';

class BankSlipsRoutes {
  public router: Router;
  private bankSlipsController: BankSlipsController;

  constructor() {
    this.bankSlipsController = new BankSlipsController();
    this.router = express.Router();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/bankslips',
      AuthMiddleware.routeFilter,
      (request, response) =>
        this.bankSlipsController.postSlip(request, response),
    );

    this.router.get(
      '/bankslips',
      AuthMiddleware.routeFilter,
      this.bankSlipsController.getSlips,
      /*       (request, response) =>
        this.bankSlipsController.getSlips(request, response), */
    );

    this.router.get(
      '/bankslips/:id',
      AuthMiddleware.routeFilter,
      (request, response) =>
        this.bankSlipsController.getSlipsById(request, response),
    );

    this.router.post(
      '/bankslips/:id/payments',
      AuthMiddleware.routeFilter,
      (request, response) =>
        this.bankSlipsController.paySlip(request, response),
    );

    this.router.delete(
      '/bankslips/:id',
      AuthMiddleware.routeFilter,
      (request, response) =>
        this.bankSlipsController.cancelSlip(request, response),
    );
  }
}

export default new BankSlipsRoutes().router;
