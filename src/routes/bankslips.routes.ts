import express, { Router } from 'express';
import BankSlipsController from '../controllers/bankSlipsController';
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
      this.bankSlipsController.postSlip,
    );
    this.router.get(
      '/bankslips',
      AuthMiddleware.routeFilter,
      this.bankSlipsController.getSlips,
    );
    this.router.get(
      '/bankslips/:id',
      AuthMiddleware.routeFilter,
      this.bankSlipsController.getSlipsById,
    );
    this.router.post(
      '/bankslips/:id/payments',
      AuthMiddleware.routeFilter,
      this.bankSlipsController.paySlip,
    );
    this.router.delete(
      '/bankslips/:id',
      AuthMiddleware.routeFilter,
      this.bankSlipsController.cancelSlip,
    );
  }
}

export default new BankSlipsRoutes().router;
