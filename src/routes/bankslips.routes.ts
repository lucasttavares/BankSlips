import express from 'express';
import {
  getSlips,
  postSlip,
  cancelSlip,
  paySlip,
} from '../controllers/bankSlipsController';

const router = express.Router();

router.post('/bankslips', postSlip);
router.get('/bankslips', getSlips);
router.delete('/bankslips/:id', cancelSlip);
router.post('/bankslips/:id/payments', paySlip);

module.exports = (app: any) => app.use('/rest', router);
