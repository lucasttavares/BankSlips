import express from 'express';
import BankSlipsController from '../controllers/bankSlipsController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
  '/bankslips',
  AuthMiddleware.routeFilter,
  BankSlipsController.postSlip,
);
router.get(
  '/bankslips',
  AuthMiddleware.routeFilter,
  BankSlipsController.getSlips,
);
router.get(
  '/bankslips/:id',
  AuthMiddleware.routeFilter,
  BankSlipsController.getSlipsById,
);
router.post(
  '/bankslips/:id/payments',
  AuthMiddleware.routeFilter,
  BankSlipsController.paySlip,
);
router.delete(
  '/bankslips/:id',
  AuthMiddleware.routeFilter,
  BankSlipsController.cancelSlip,
);

export default router;
