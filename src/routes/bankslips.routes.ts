import express from 'express';
import {
  getSlips,
  postSlip,
  getSlipsById,
  cancelSlip,
  paySlip,
} from '../controllers/bankSlipsController';
import AuthController from '../controllers/authController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/auth', AuthController.singIn);
router.post('/bankslips', AuthMiddleware.routeFilter, postSlip);
router.get('/bankslips', AuthMiddleware.routeFilter, getSlips);
router.get('/bankslips/:id', AuthMiddleware.routeFilter, getSlipsById);
router.post('/bankslips/:id/payments', AuthMiddleware.routeFilter, paySlip);
router.delete('/bankslips/:id', AuthMiddleware.routeFilter, cancelSlip);

module.exports = (app: any) => app.use('/rest', router);
